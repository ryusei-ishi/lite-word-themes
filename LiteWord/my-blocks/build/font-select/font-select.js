/******/ (() => { // webpackBootstrap
/*!**********************************!*\
  !*** ./src/font-select/index.js ***!
  \**********************************/
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
/* ------------------------------------------------------------
 * LiteWord – RichText Format: Font & Decoration Combo (改善版)
 * ─ フォント種 / サイズ(PC／SP) / 太さ / 行間(PC／SP) / 字間(PC／SP) / 余白上下左右 / 下線
 * ─ 縁取り(PC)・縁取り(SP)・縁取り色
 * ─ 位置そろえ(PC／SP)
 * ─ <span data-lw_font_set="◯◯" class="custom-font-settings …">…</span>
 * ---------------------------------------------------------- */

var registerFormatType = wp.richText.registerFormatType;
var _wp$element = wp.element,
  Fragment = _wp$element.Fragment,
  useState = _wp$element.useState;
var BlockControls = wp.blockEditor.BlockControls;
var _wp$components = wp.components,
  ToolbarGroup = _wp$components.ToolbarGroup,
  ToolbarButton = _wp$components.ToolbarButton,
  Popover = _wp$components.Popover,
  SelectControl = _wp$components.SelectControl,
  Button = _wp$components.Button,
  TabPanel = _wp$components.TabPanel;

/* ===== オプション配列（既存のものを維持） ============================================= */
/* 1) フォントウェイト ------------------------------------------------ */
var fontWeightOptions = [{
  label: '未選択',
  value: ''
}, {
  label: 'Thin (100)',
  value: 'fw-100'
}, {
  label: 'Extra Light (200)',
  value: 'fw-200'
}, {
  label: 'Light (300)',
  value: 'fw-300'
}, {
  label: 'Normal (400)',
  value: 'fw-400'
}, {
  label: 'Medium (500)',
  value: 'fw-500'
}, {
  label: 'Semi Bold (600)',
  value: 'fw-600'
}, {
  label: 'Bold (700)',
  value: 'fw-700'
}, {
  label: 'Extra Bold (800)',
  value: 'fw-800'
}, {
  label: 'Black (900)',
  value: 'fw-900'
}];

/* 2) フォントサイズ -------------------------------------------------- */
var fontSizeOptions = [{
  label: '未選択',
  value: ''
}, {
  label: '0.1倍',
  value: 'fs-0-1'
}, {
  label: '0.2倍',
  value: 'fs-0-2'
}, {
  label: '0.3倍',
  value: 'fs-0-3'
}, {
  label: '0.4倍',
  value: 'fs-0-4'
}, {
  label: '0.5倍',
  value: 'fs-0-5'
}, {
  label: '0.6倍',
  value: 'fs-0-6'
}, {
  label: '0.7倍',
  value: 'fs-0-7'
}, {
  label: '0.8倍',
  value: 'fs-0-8'
}, {
  label: '0.9倍',
  value: 'fs-0-9'
}, {
  label: '1倍',
  value: 'fs-1'
}, {
  label: '1.1倍',
  value: 'fs-1-1'
}, {
  label: '1.2倍',
  value: 'fs-1-2'
}, {
  label: '1.3倍',
  value: 'fs-1-3'
}, {
  label: '1.4倍',
  value: 'fs-1-4'
}, {
  label: '1.5倍',
  value: 'fs-1-5'
}, {
  label: '1.6倍',
  value: 'fs-1-6'
}, {
  label: '1.7倍',
  value: 'fs-1-7'
}, {
  label: '1.8倍',
  value: 'fs-1-8'
}, {
  label: '1.9倍',
  value: 'fs-1-9'
}, {
  label: '2倍',
  value: 'fs-2'
}, {
  label: '2.1倍',
  value: 'fs-2-1'
}, {
  label: '2.2倍',
  value: 'fs-2-2'
}, {
  label: '2.3倍',
  value: 'fs-2-3'
}, {
  label: '2.4倍',
  value: 'fs-2-4'
}, {
  label: '2.5倍',
  value: 'fs-2-5'
}, {
  label: '2.6倍',
  value: 'fs-2-6'
}, {
  label: '2.7倍',
  value: 'fs-2-7'
}, {
  label: '2.8倍',
  value: 'fs-2-8'
}, {
  label: '2.9倍',
  value: 'fs-2-9'
}, {
  label: '3倍',
  value: 'fs-3'
}, {
  label: '3.1倍',
  value: 'fs-3-1'
}, {
  label: '3.2倍',
  value: 'fs-3-2'
}, {
  label: '3.3倍',
  value: 'fs-3-3'
}, {
  label: '3.4倍',
  value: 'fs-3-4'
}, {
  label: '3.5倍',
  value: 'fs-3-5'
}, {
  label: '3.6倍',
  value: 'fs-3-6'
}, {
  label: '3.7倍',
  value: 'fs-3-7'
}, {
  label: '3.8倍',
  value: 'fs-3-8'
}, {
  label: '3.9倍',
  value: 'fs-3-9'
}, {
  label: '4倍',
  value: 'fs-4'
}];

/* 2) フォントサイズ sp -------------------------------------------------- */
var fontSizeOptionsSp = [{
  label: '未選択',
  value: ''
}, {
  label: '0.1倍',
  value: 'fs-sp-0-1'
}, {
  label: '0.2倍',
  value: 'fs-sp-0-2'
}, {
  label: '0.3倍',
  value: 'fs-sp-0-3'
}, {
  label: '0.4倍',
  value: 'fs-sp-0-4'
}, {
  label: '0.5倍',
  value: 'fs-sp-0-5'
}, {
  label: '0.6倍',
  value: 'fs-sp-0-6'
}, {
  label: '0.7倍',
  value: 'fs-sp-0-7'
}, {
  label: '0.8倍',
  value: 'fs-sp-0-8'
}, {
  label: '0.9倍',
  value: 'fs-sp-0-9'
}, {
  label: '1倍',
  value: 'fs-sp-1'
}, {
  label: '1.1倍',
  value: 'fs-sp-1-1'
}, {
  label: '1.2倍',
  value: 'fs-sp-1-2'
}, {
  label: '1.3倍',
  value: 'fs-sp-1-3'
}, {
  label: '1.4倍',
  value: 'fs-sp-1-4'
}, {
  label: '1.5倍',
  value: 'fs-sp-1-5'
}, {
  label: '1.6倍',
  value: 'fs-sp-1-6'
}, {
  label: '1.7倍',
  value: 'fs-sp-1-7'
}, {
  label: '1.8倍',
  value: 'fs-sp-1-8'
}, {
  label: '1.9倍',
  value: 'fs-sp-1-9'
}, {
  label: '2倍',
  value: 'fs-sp-2'
}, {
  label: '2.1倍',
  value: 'fs-sp-2-1'
}, {
  label: '2.2倍',
  value: 'fs-sp-2-2'
}, {
  label: '2.3倍',
  value: 'fs-sp-2-3'
}, {
  label: '2.4倍',
  value: 'fs-sp-2-4'
}, {
  label: '2.5倍',
  value: 'fs-sp-2-5'
}, {
  label: '2.6倍',
  value: 'fs-sp-2-6'
}, {
  label: '2.7倍',
  value: 'fs-sp-2-7'
}, {
  label: '2.8倍',
  value: 'fs-sp-2-8'
}, {
  label: '2.9倍',
  value: 'fs-sp-2-9'
}, {
  label: '3倍',
  value: 'fs-sp-3'
}, {
  label: '3.1倍',
  value: 'fs-sp-3-1'
}, {
  label: '3.2倍',
  value: 'fs-sp-3-2'
}, {
  label: '3.3倍',
  value: 'fs-sp-3-3'
}, {
  label: '3.4倍',
  value: 'fs-sp-3-4'
}, {
  label: '3.5倍',
  value: 'fs-sp-3-5'
}, {
  label: '3.6倍',
  value: 'fs-sp-3-6'
}, {
  label: '3.7倍',
  value: 'fs-sp-3-7'
}, {
  label: '3.8倍',
  value: 'fs-sp-3-8'
}, {
  label: '3.9倍',
  value: 'fs-sp-3-9'
}, {
  label: '4倍',
  value: 'fs-sp-4'
}];

/* 3) テキストの位置調整 PC ------------------------------------------------- */
var centerOptions = [{
  label: '未選択',
  value: ''
}, {
  label: '中央寄せ',
  value: 'text-center'
}, {
  label: '左寄せ',
  value: 'text-left'
}, {
  label: '右寄せ',
  value: 'text-right'
}, {
  label: '両端揃え',
  value: 'text-justify'
}];
/* 3) テキストの位置調整 SP ------------------------------------------------- */
var centerOptionsSp = [{
  label: '未選択',
  value: ''
}, {
  label: '中央寄せ',
  value: 'text-center-sp'
}, {
  label: '左寄せ',
  value: 'text-left-sp'
}, {
  label: '右寄せ',
  value: 'text-right-sp'
}, {
  label: '両端揃え',
  value: 'text-justify-sp'
}];

/* 4) 行間 ----------------------------------------------------------- */
var lineHeightOptions = [{
  label: '未選択',
  value: ''
}, {
  label: '0.8',
  value: 'lh-0-8'
}, {
  label: '0.9',
  value: 'lh-0-9'
}, {
  label: '1',
  value: 'lh-1'
}, {
  label: '1.1',
  value: 'lh-1-1'
}, {
  label: '1.2',
  value: 'lh-1-2'
}, {
  label: '1.3',
  value: 'lh-1-3'
}, {
  label: '1.4',
  value: 'lh-1-4'
}, {
  label: '1.5',
  value: 'lh-1-5'
}, {
  label: '1.6',
  value: 'lh-1-6'
}, {
  label: '1.7',
  value: 'lh-1-7'
}, {
  label: '1.8',
  value: 'lh-1-8'
}, {
  label: '1.9',
  value: 'lh-1-9'
}, {
  label: '2',
  value: 'lh-2'
}, {
  label: '2.1',
  value: 'lh-2-1'
}, {
  label: '2.2',
  value: 'lh-2-2'
}, {
  label: '2.3',
  value: 'lh-2-3'
}, {
  label: '2.4',
  value: 'lh-2-4'
}, {
  label: '2.5',
  value: 'lh-2-5'
}, {
  label: '2.6',
  value: 'lh-2-6'
}, {
  label: '2.7',
  value: 'lh-2-7'
}, {
  label: '2.8',
  value: 'lh-2-8'
}, {
  label: '2.9',
  value: 'lh-2-9'
}, {
  label: '3',
  value: 'lh-3'
}];

/* 4) 行間 sp ----------------------------------------------------------- */
var lineHeightOptionsSp = [{
  label: '未選択',
  value: ''
}, {
  label: '0.8',
  value: 'lh-sp-0-8'
}, {
  label: '0.9',
  value: 'lh-sp-0-9'
}, {
  label: '1',
  value: 'lh-sp-1'
}, {
  label: '1.1',
  value: 'lh-sp-1-1'
}, {
  label: '1.2',
  value: 'lh-sp-1-2'
}, {
  label: '1.3',
  value: 'lh-sp-1-3'
}, {
  label: '1.4',
  value: 'lh-sp-1-4'
}, {
  label: '1.5',
  value: 'lh-sp-1-5'
}, {
  label: '1.6',
  value: 'lh-sp-1-6'
}, {
  label: '1.7',
  value: 'lh-sp-1-7'
}, {
  label: '1.8',
  value: 'lh-sp-1-8'
}, {
  label: '1.9',
  value: 'lh-sp-1-9'
}, {
  label: '2',
  value: 'lh-sp-2'
}, {
  label: '2.1',
  value: 'lh-sp-2-1'
}, {
  label: '2.2',
  value: 'lh-sp-2-2'
}, {
  label: '2.3',
  value: 'lh-sp-2-3'
}, {
  label: '2.4',
  value: 'lh-sp-2-4'
}, {
  label: '2.5',
  value: 'lh-sp-2-5'
}, {
  label: '2.6',
  value: 'lh-sp-2-6'
}, {
  label: '2.7',
  value: 'lh-sp-2-7'
}, {
  label: '2.8',
  value: 'lh-sp-2-8'
}, {
  label: '2.9',
  value: 'lh-sp-2-9'
}, {
  label: '3',
  value: 'lh-sp-3'
}];

/* 5) 文字間 --------------------------------------------------------- */
var letterSpacingOptions = [{
  label: '未選択',
  value: ''
}, {
  label: '0',
  value: 'ls-0'
}, {
  label: '0.05',
  value: 'ls-0-05'
}, {
  label: '0.06',
  value: 'ls-0-06'
}, {
  label: '0.07',
  value: 'ls-0-07'
}, {
  label: '0.08',
  value: 'ls-0-08'
}, {
  label: '0.09',
  value: 'ls-0-09'
}, {
  label: '0.1',
  value: 'ls-0-1'
}, {
  label: '0.2',
  value: 'ls-0-2'
}, {
  label: '0.3',
  value: 'ls-0-3'
}];

/* 5) 文字間 sp --------------------------------------------------------- */
var letterSpacingOptionsSp = [{
  label: '未選択',
  value: ''
}, {
  label: '0',
  value: 'ls-sp-0'
}, {
  label: '0.05',
  value: 'ls-sp-0-05'
}, {
  label: '0.06',
  value: 'ls-sp-0-06'
}, {
  label: '0.07',
  value: 'ls-sp-0-07'
}, {
  label: '0.08',
  value: 'ls-sp-0-08'
}, {
  label: '0.09',
  value: 'ls-sp-0-09'
}, {
  label: '0.1',
  value: 'ls-sp-0-1'
}, {
  label: '0.2',
  value: 'ls-sp-0-2'
}, {
  label: '0.3',
  value: 'ls-sp-0-3'
}];

/* 5-a) 余白（上） ---------------------------------------------------- */
var marginTopOptions = [{
  label: '未選択',
  value: ''
}, {
  label: '-0.5em',
  value: 'mt--0-5'
}, {
  label: '-0.4em',
  value: 'mt--0-4'
}, {
  label: '-0.3em',
  value: 'mt--0-3'
}, {
  label: '-0.2em',
  value: 'mt--0-2'
}, {
  label: '-0.1em',
  value: 'mt--0-1'
}, {
  label: '0',
  value: 'mt-0'
}, {
  label: '0.1em',
  value: 'mt-0-1'
}, {
  label: '0.2em',
  value: 'mt-0-2'
}, {
  label: '0.3em',
  value: 'mt-0-3'
}, {
  label: '0.4em',
  value: 'mt-0-4'
}, {
  label: '0.5em',
  value: 'mt-0-5'
}, {
  label: '0.6em',
  value: 'mt-0-6'
}, {
  label: '0.7em',
  value: 'mt-0-7'
}, {
  label: '0.8em',
  value: 'mt-0-8'
}, {
  label: '0.9em',
  value: 'mt-0-9'
}, {
  label: '1em',
  value: 'mt-1'
}, {
  label: '1.1em',
  value: 'mt-1-1'
}, {
  label: '1.2em',
  value: 'mt-1-2'
}, {
  label: '1.3em',
  value: 'mt-1-3'
}, {
  label: '1.4em',
  value: 'mt-1-4'
}, {
  label: '1.5em',
  value: 'mt-1-5'
}, {
  label: '1.6em',
  value: 'mt-1-6'
}, {
  label: '1.7em',
  value: 'mt-1-7'
}, {
  label: '1.8em',
  value: 'mt-1-8'
}, {
  label: '1.9em',
  value: 'mt-1-9'
}, {
  label: '2em',
  value: 'mt-2'
}];

/* 5-b) 余白（下） ---------------------------------------------------- */
var marginBottomOptions = [{
  label: '未選択',
  value: ''
}, {
  label: '-0.5em',
  value: 'mb--0-5'
}, {
  label: '-0.4em',
  value: 'mb--0-4'
}, {
  label: '-0.3em',
  value: 'mb--0-3'
}, {
  label: '-0.2em',
  value: 'mb--0-2'
}, {
  label: '-0.1em',
  value: 'mb--0-1'
}, {
  label: '0',
  value: 'mb-0'
}, {
  label: '0.1em',
  value: 'mb-0-1'
}, {
  label: '0.2em',
  value: 'mb-0-2'
}, {
  label: '0.3em',
  value: 'mb-0-3'
}, {
  label: '0.4em',
  value: 'mb-0-4'
}, {
  label: '0.5em',
  value: 'mb-0-5'
}, {
  label: '0.6em',
  value: 'mb-0-6'
}, {
  label: '0.7em',
  value: 'mb-0-7'
}, {
  label: '0.8em',
  value: 'mb-0-8'
}, {
  label: '0.9em',
  value: 'mb-0-9'
}, {
  label: '1em',
  value: 'mb-1'
}, {
  label: '1.1em',
  value: 'mb-1-1'
}, {
  label: '1.2em',
  value: 'mb-1-2'
}, {
  label: '1.3em',
  value: 'mb-1-3'
}, {
  label: '1.4em',
  value: 'mb-1-4'
}, {
  label: '1.5em',
  value: 'mb-1-5'
}, {
  label: '1.6em',
  value: 'mb-1-6'
}, {
  label: '1.7em',
  value: 'mb-1-7'
}, {
  label: '1.8em',
  value: 'mb-1-8'
}, {
  label: '1.9em',
  value: 'mb-1-9'
}, {
  label: '2em',
  value: 'mb-2'
}];

/* 5-c) 余白（左） ---------------------------------------------------- */
var marginLeftOptions = [{
  label: '未選択',
  value: ''
}, {
  label: '-0.6em',
  value: 'ml--0-6'
}, {
  label: '-0.5em',
  value: 'ml--0-5'
}, {
  label: '-0.4em',
  value: 'ml--0-4'
}, {
  label: '-0.3em',
  value: 'ml--0-3'
}, {
  label: '-0.2em',
  value: 'ml--0-2'
}, {
  label: '-0.1em',
  value: 'ml--0-1'
}, {
  label: '0',
  value: 'ml-0'
}, {
  label: '0.1em',
  value: 'ml-0-1'
}, {
  label: '0.2em',
  value: 'ml-0-2'
}, {
  label: '0.3em',
  value: 'ml-0-3'
}, {
  label: '0.4em',
  value: 'ml-0-4'
}, {
  label: '0.5em',
  value: 'ml-0-5'
}, {
  label: '0.6em',
  value: 'ml-0-6'
}, {
  label: '0.7em',
  value: 'ml-0-7'
}, {
  label: '0.8em',
  value: 'ml-0-8'
}, {
  label: '0.9em',
  value: 'ml-0-9'
}, {
  label: '1em',
  value: 'ml-1'
}];

/* 5-d) 余白（右） ---------------------------------------------------- */
var marginRightOptions = [{
  label: '未選択',
  value: ''
}, {
  label: '-0.6em',
  value: 'mr--0-6'
}, {
  label: '-0.5em',
  value: 'mr--0-5'
}, {
  label: '-0.4em',
  value: 'mr--0-4'
}, {
  label: '-0.3em',
  value: 'mr--0-3'
}, {
  label: '-0.2em',
  value: 'mr--0-2'
}, {
  label: '-0.1em',
  value: 'mr--0-1'
}, {
  label: '0',
  value: 'mr-0'
}, {
  label: '0.1em',
  value: 'mr-0-1'
}, {
  label: '0.2em',
  value: 'mr-0-2'
}, {
  label: '0.3em',
  value: 'mr-0-3'
}, {
  label: '0.4em',
  value: 'mr-0-4'
}, {
  label: '0.5em',
  value: 'mr-0-5'
}, {
  label: '0.6em',
  value: 'mr-0-6'
}, {
  label: '0.7em',
  value: 'mr-0-7'
}, {
  label: '0.8em',
  value: 'mr-0-8'
}, {
  label: '0.9em',
  value: 'mr-0-9'
}, {
  label: '1em',
  value: 'mr-1'
}];

/* 6) フォントファミリー --------------------------------------------- */
// PHPから渡されたフォントファミリーオプションを使用
var fontFamilyOptions = window.lwFontSettings && window.lwFontSettings.fontFamilyOptions ? window.lwFontSettings.fontFamilyOptions : [{
  label: '未選択',
  value: ''
}, {
  label: '明朝体（システムフォント）',
  value: 'mincho'
}, {
  label: 'ゴシック（システムフォント）',
  value: 'gothic'
}];

/* 7) 下線スタイル ---------------------------------------------------- */
var underlineOptions = [{
  label: '未選択',
  value: ''
}, {
  label: '下線 1 / Red',
  value: 'u-line-1-red'
}, {
  label: '下線 1 / pink',
  value: 'u-line-1-pink'
}, {
  label: '下線 1 / pink 2',
  value: 'u-line-1-pink-2'
}, {
  label: '下線 1 / Blue',
  value: 'u-line-1-blue'
}, {
  label: '下線 1 / Green',
  value: 'u-line-1-green'
}, {
  label: '下線 1 / Yellow',
  value: 'u-line-1-yellow'
}, {
  label: '下線 1 / Orange',
  value: 'u-line-1-orange'
}, {
  label: '下線 1 / Main',
  value: 'u-line-1-main'
}, {
  label: '下線 1 / Accent',
  value: 'u-line-1-accent'
}, {
  label: '下線 1 / color_1',
  value: 'u-line-1-color_1'
}, {
  label: '下線 1 / color_2',
  value: 'u-line-1-color_2'
}, {
  label: '下線 1 / color_3',
  value: 'u-line-1-color_3'
}, {
  label: '下線 2 / Red',
  value: 'u-line-2-red'
}, {
  label: '下線 2 / pink',
  value: 'u-line-2-pink'
}, {
  label: '下線 2 / pink 2',
  value: 'u-line-2-pink-2'
}, {
  label: '下線 2 / Blue',
  value: 'u-line-2-blue'
}, {
  label: '下線 2 / Green',
  value: 'u-line-2-green'
}, {
  label: '下線 2 / Yellow',
  value: 'u-line-2-yellow'
}, {
  label: '下線 2 / Orange',
  value: 'u-line-2-orange'
}, {
  label: '下線 2 / Main',
  value: 'u-line-2-main'
}, {
  label: '下線 2 / Accent',
  value: 'u-line-2-accent'
}, {
  label: '下線 2 / color_1',
  value: 'u-line-2-color_1'
}, {
  label: '下線 2 / color_2',
  value: 'u-line-2-color_2'
}, {
  label: '下線 2 / color_3',
  value: 'u-line-2-color_3'
}, {
  label: '背景 3 / Red',
  value: 'u-line-3-red'
}, {
  label: '背景 3 / pink',
  value: 'u-line-3-pink'
}, {
  label: '背景 3 / pink 2',
  value: 'u-line-3-pink-2'
}, {
  label: '背景 3 / Blue',
  value: 'u-line-3-blue'
}, {
  label: '背景 3 / Green',
  value: 'u-line-3-green'
}, {
  label: '背景 3 / Yellow',
  value: 'u-line-3-yellow'
}, {
  label: '背景 3 / Orange',
  value: 'u-line-3-orange'
}, {
  label: '背景 3 / Main',
  value: 'u-line-3-main'
}, {
  label: '背景 3 / Accent',
  value: 'u-line-3-accent'
}, {
  label: '背景 3 / color_1',
  value: 'u-line-3-color_1'
}, {
  label: '背景 3 / color_2',
  value: 'u-line-3-color_2'
}, {
  label: '背景 3 / color_3',
  value: 'u-line-3-color_3'
}];

/* 8-a) 縁取り PC ----------------------------------------------------- */
var outlineOptionsPc = [{
  label: '未選択',
  value: ''
}, {
  label: '1px',
  value: 'lw-outline-1'
}, {
  label: '2px',
  value: 'lw-outline-2'
}, {
  label: '3px',
  value: 'lw-outline-3'
}, {
  label: '4px',
  value: 'lw-outline-4'
}, {
  label: '5px',
  value: 'lw-outline-5'
}, {
  label: '6px',
  value: 'lw-outline-6'
}, {
  label: '7px',
  value: 'lw-outline-7'
}, {
  label: '8px',
  value: 'lw-outline-8'
}, {
  label: '9px',
  value: 'lw-outline-9'
}, {
  label: '10px',
  value: 'lw-outline-10'
}];

/* 8-b) 縁取り SP ----------------------------------------------------- */
var outlineOptionsSp = [{
  label: '未選択',
  value: ''
}, {
  label: '1px',
  value: 'lw-outline-1-sp'
}, {
  label: '2px',
  value: 'lw-outline-2-sp'
}, {
  label: '3px',
  value: 'lw-outline-3-sp'
}, {
  label: '4px',
  value: 'lw-outline-4-sp'
}, {
  label: '5px',
  value: 'lw-outline-5-sp'
}, {
  label: '6px',
  value: 'lw-outline-6-sp'
}, {
  label: '7px',
  value: 'lw-outline-7-sp'
}, {
  label: '8px',
  value: 'lw-outline-8-sp'
}, {
  label: '9px',
  value: 'lw-outline-9-sp'
}, {
  label: '10px',
  value: 'lw-outline-10-sp'
}];

/* 8-c) 縁取り色 ------------------------------------------------------ */
var outlineOptionsColor = [{
  label: '未選択',
  value: ''
}, {
  label: 'White',
  value: 'lw-outline-color-white'
}, {
  label: 'Red',
  value: 'lw-outline-color-red'
}, {
  label: 'Main',
  value: 'lw-outline-color-main'
}, {
  label: 'Accent',
  value: 'lw-outline-color-accent'
}, {
  label: 'color_1',
  value: 'lw-outline-color-color_1'
}, {
  label: 'color_2',
  value: 'lw-outline-color-color_2'
}, {
  label: 'color_3',
  value: 'lw-outline-color-color_3'
}];

/* ===== カスタムコンポーネント ============================================ */

// セクションヘッダーコンポーネント
var SectionHeader = function SectionHeader(_ref) {
  var title = _ref.title,
    icon = _ref.icon;
  return /*#__PURE__*/React.createElement("div", {
    className: "lw-font-section-header"
  }, icon && /*#__PURE__*/React.createElement("span", {
    className: "dashicons dashicons-{icon}"
  }), /*#__PURE__*/React.createElement("span", null, title));
};

// カスタムセレクトコンポーネント（コンパクト版）
var CompactSelect = function CompactSelect(_ref2) {
  var label = _ref2.label,
    value = _ref2.value,
    options = _ref2.options,
    onChange = _ref2.onChange;
  return /*#__PURE__*/React.createElement("div", {
    className: "lw-font-control-compact"
  }, /*#__PURE__*/React.createElement("label", null, label), /*#__PURE__*/React.createElement(SelectControl, {
    value: value,
    options: options,
    onChange: onChange
  }));
};

// グリッドレイアウトコンポーネント
var ControlGrid = function ControlGrid(_ref3) {
  var children = _ref3.children;
  return /*#__PURE__*/React.createElement("div", {
    className: "lw-font-control-grid"
  }, children);
};

/* ===== フォーマット登録 ============================================ */
registerFormatType('custom/font-combo', {
  title: 'フォント設定',
  tagName: 'span',
  className: 'custom-font-settings',
  attributes: {
    "class": 'class',
    'data-lw_font_set': 'data-lw_font_set'
  },
  edit: function edit(_ref4) {
    var value = _ref4.value,
      onChange = _ref4.onChange;
    var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      isOpen = _useState2[0],
      setIsOpen = _useState2[1];

    /* --- 現行クラス取得 ------------------------------------ */
    var fmt = wp.richText.getActiveFormat(value, 'custom/font-combo');
    var currentFont = fmt ? fmt.attributes['data-lw_font_set'] : '';
    var classes = fmt ? fmt.attributes["class"] || '' : '';
    var findClass = function findClass(prefix) {
      var cond = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {
        return true;
      };
      return classes.split(' ').find(function (c) {
        return c.startsWith(prefix) && cond(c);
      }) || '';
    };

    /* センタリング取得用ユーティリティ */
    var getClassFromList = function getClassFromList(list) {
      return classes.split(' ').find(function (c) {
        return list.includes(c);
      }) || '';
    };
    var curSize = findClass('fs-', function (c) {
      return !c.startsWith('fs-sp-');
    });
    var curSizeSp = findClass('fs-sp-');
    var curWeight = findClass('fw-');
    var curLine = findClass('lh-', function (c) {
      return !c.startsWith('lh-sp-');
    });
    var curLineSp = findClass('lh-sp-');
    var curLetter = findClass('ls-', function (c) {
      return !c.startsWith('ls-sp-');
    });
    var curLetterSp = findClass('ls-sp-');
    var curMt = findClass('mt-');
    var curMb = findClass('mb-');
    var curMl = findClass('ml-');
    var curMr = findClass('mr-');
    var curUnderline = findClass('u-line-');
    var curOutPc = findClass('lw-outline-', function (c) {
      return !c.includes('-sp') && !c.includes('-color-');
    });
    var curOutSp = findClass('lw-outline-', function (c) {
      return c.includes('-sp');
    });
    var curOutCol = findClass('lw-outline-color-');
    var curCenterPc = getClassFromList(['text-center', 'text-left', 'text-right', 'text-justify']);
    var curCenterSp = getClassFromList(['text-center-sp', 'text-left-sp', 'text-right-sp', 'text-justify-sp']);

    /* --- 更新ハンドラ -------------------------------------- */
    var apply = function apply() {
      var fFamily = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : currentFont;
      var fSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : curSize;
      var fSizeSp = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : curSizeSp;
      var fWeight = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : curWeight;
      var lHeight = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : curLine;
      var lHeightSp = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : curLineSp;
      var lSpace = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : curLetter;
      var lSpaceSp = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : curLetterSp;
      var mTop = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : curMt;
      var mBottom = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : curMb;
      var mLeft = arguments.length > 10 && arguments[10] !== undefined ? arguments[10] : curMl;
      var mRight = arguments.length > 11 && arguments[11] !== undefined ? arguments[11] : curMr;
      var uLine = arguments.length > 12 && arguments[12] !== undefined ? arguments[12] : curUnderline;
      var oPc = arguments.length > 13 && arguments[13] !== undefined ? arguments[13] : curOutPc;
      var oSp = arguments.length > 14 && arguments[14] !== undefined ? arguments[14] : curOutSp;
      var oColor = arguments.length > 15 && arguments[15] !== undefined ? arguments[15] : curOutCol;
      var cPc = arguments.length > 16 && arguments[16] !== undefined ? arguments[16] : curCenterPc;
      var cSp = arguments.length > 17 && arguments[17] !== undefined ? arguments[17] : curCenterSp;
      var nv = wp.richText.removeFormat(value, 'custom/font-combo');

      /* 残すクラス判定 ----------------------------------- */
      var alignmentClasses = ['text-center', 'text-left', 'text-right', 'text-justify', 'text-center-sp', 'text-left-sp', 'text-right-sp', 'text-justify-sp'];
      var keep = classes.split(' ').filter(Boolean).filter(function (c) {
        return !c.startsWith('fs-') && !c.startsWith('fw-') && !c.startsWith('lh-') && !c.startsWith('ls-') && !c.startsWith('mt-') && !c.startsWith('mb-') && !c.startsWith('ml-') && !c.startsWith('mr-') && !c.startsWith('u-line-') && !c.startsWith('lw-outline-') && !c.startsWith('lw-outline-color-') && !alignmentClasses.includes(c);
      });
      var set = new Set(['custom-font-settings'].concat(_toConsumableArray(keep)));
      if (fSize) set.add(fSize);
      if (fSizeSp) set.add(fSizeSp);
      if (fWeight) set.add(fWeight);
      if (lHeight) set.add(lHeight);
      if (lHeightSp) set.add(lHeightSp);
      if (lSpace) set.add(lSpace);
      if (lSpaceSp) set.add(lSpaceSp);
      if (mTop) set.add(mTop);
      if (mBottom) set.add(mBottom);
      if (mLeft) set.add(mLeft);
      if (mRight) set.add(mRight);
      if (uLine) set.add(uLine);
      if (oPc) set.add(oPc);
      if (oSp) set.add(oSp);
      if (oColor) set.add(oColor);
      if (cPc) set.add(cPc);
      if (cSp) set.add(cSp);
      nv = wp.richText.applyFormat(nv, {
        type: 'custom/font-combo',
        attributes: {
          'data-lw_font_set': fFamily,
          "class": Array.from(set).join(' ')
        }
      });
      onChange(nv);
    };

    /* --- リセット機能 -------------------------------------- */
    var resetAllSettings = function resetAllSettings() {
      var nv = wp.richText.removeFormat(value, 'custom/font-combo');
      onChange(nv);
    };

    /* --- UI ---------------------------------------------- */
    return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement(BlockControls, null, /*#__PURE__*/React.createElement(ToolbarGroup, null, /*#__PURE__*/React.createElement(ToolbarButton, {
      icon: "admin-customizer",
      label: "Lw \u30D5\u30A9\u30F3\u30C8\u8A2D\u5B9A",
      isPressed: isOpen,
      onClick: function onClick() {
        return setIsOpen(!isOpen);
      }
    }))), isOpen && /*#__PURE__*/React.createElement(Popover, {
      position: "bottom center",
      onClose: function onClose() {
        return setIsOpen(false);
      },
      className: "lw-custom-font-settings-popover"
    }, /*#__PURE__*/React.createElement("div", {
      className: "lw-font-settings-header"
    }, /*#__PURE__*/React.createElement("h3", null, /*#__PURE__*/React.createElement("span", {
      className: "dashicons dashicons-edit"
    }), "\u30D5\u30A9\u30F3\u30C8\u8A2D\u5B9A"), /*#__PURE__*/React.createElement(Button, {
      className: "lw-font-reset-button",
      onClick: resetAllSettings,
      isDestructive: true,
      isSmall: true
    }, "\u3059\u3079\u3066\u30EA\u30BB\u30C3\u30C8")), /*#__PURE__*/React.createElement(TabPanel, {
      className: "lw-font-settings-tabs",
      activeClass: "is-active",
      tabs: [{
        name: 'basic',
        title: '基本設定',
        className: 'lw-tab-basic'
      }, {
        name: 'spacing',
        title: '余白・配置',
        className: 'lw-tab-spacing'
      }, {
        name: 'decoration',
        title: '装飾',
        className: 'lw-tab-decoration'
      }]
    }, function (tab) {
      if (tab.name === 'basic') {
        return /*#__PURE__*/React.createElement("div", {
          className: "lw-font-tab-content"
        }, /*#__PURE__*/React.createElement("div", {
          className: "lw-font-control-section"
        }, /*#__PURE__*/React.createElement(SectionHeader, {
          title: "\u30D5\u30A9\u30F3\u30C8\u30D5\u30A1\u30DF\u30EA\u30FC"
        }), /*#__PURE__*/React.createElement(SelectControl, {
          value: currentFont,
          options: fontFamilyOptions,
          onChange: function onChange(v) {
            return apply(v);
          }
        })), /*#__PURE__*/React.createElement("div", {
          className: "lw-font-control-section"
        }, /*#__PURE__*/React.createElement(SectionHeader, {
          title: "\u30D5\u30A9\u30F3\u30C8\u30B5\u30A4\u30BA"
        }), /*#__PURE__*/React.createElement(ControlGrid, null, /*#__PURE__*/React.createElement(CompactSelect, {
          label: "PC",
          value: curSize,
          options: fontSizeOptions,
          onChange: function onChange(v) {
            return apply(undefined, v);
          }
        }), /*#__PURE__*/React.createElement(CompactSelect, {
          label: "\u30B9\u30DE\u30DB",
          value: curSizeSp,
          options: fontSizeOptionsSp,
          onChange: function onChange(v) {
            return apply(undefined, undefined, v);
          }
        }))), /*#__PURE__*/React.createElement("div", {
          className: "lw-font-control-section"
        }, /*#__PURE__*/React.createElement(SectionHeader, {
          title: "\u30D5\u30A9\u30F3\u30C8\u306E\u592A\u3055"
        }), /*#__PURE__*/React.createElement(SelectControl, {
          value: curWeight,
          options: fontWeightOptions,
          onChange: function onChange(v) {
            return apply(undefined, undefined, undefined, v);
          }
        })), /*#__PURE__*/React.createElement("div", {
          className: "lw-font-control-section"
        }, /*#__PURE__*/React.createElement(SectionHeader, {
          title: "\u884C\u9593"
        }), /*#__PURE__*/React.createElement(ControlGrid, null, /*#__PURE__*/React.createElement(CompactSelect, {
          label: "PC",
          value: curLine,
          options: lineHeightOptions,
          onChange: function onChange(v) {
            return apply(undefined, undefined, undefined, undefined, v);
          }
        }), /*#__PURE__*/React.createElement(CompactSelect, {
          label: "\u30B9\u30DE\u30DB",
          value: curLineSp,
          options: lineHeightOptionsSp,
          onChange: function onChange(v) {
            return apply(undefined, undefined, undefined, undefined, undefined, v);
          }
        }))), /*#__PURE__*/React.createElement("div", {
          className: "lw-font-control-section"
        }, /*#__PURE__*/React.createElement(SectionHeader, {
          title: "\u6587\u5B57\u9593"
        }), /*#__PURE__*/React.createElement(ControlGrid, null, /*#__PURE__*/React.createElement(CompactSelect, {
          label: "PC",
          value: curLetter,
          options: letterSpacingOptions,
          onChange: function onChange(v) {
            return apply(undefined, undefined, undefined, undefined, undefined, undefined, v);
          }
        }), /*#__PURE__*/React.createElement(CompactSelect, {
          label: "\u30B9\u30DE\u30DB",
          value: curLetterSp,
          options: letterSpacingOptionsSp,
          onChange: function onChange(v) {
            return apply(undefined, undefined, undefined, undefined, undefined, undefined, undefined, v);
          }
        }))));
      } else if (tab.name === 'spacing') {
        return /*#__PURE__*/React.createElement("div", {
          className: "lw-font-tab-content"
        }, /*#__PURE__*/React.createElement("div", {
          className: "lw-font-control-section"
        }, /*#__PURE__*/React.createElement(SectionHeader, {
          title: "\u4F59\u767D\u8A2D\u5B9A"
        }), /*#__PURE__*/React.createElement("div", {
          className: "lw-font-margin-controls"
        }, /*#__PURE__*/React.createElement("div", {
          className: "lw-font-margin-row"
        }, /*#__PURE__*/React.createElement(CompactSelect, {
          label: "\u4E0A",
          value: curMt,
          options: marginTopOptions,
          onChange: function onChange(v) {
            return apply(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, v);
          }
        })), /*#__PURE__*/React.createElement("div", {
          className: "lw-font-margin-row"
        }, /*#__PURE__*/React.createElement(CompactSelect, {
          label: "\u5DE6",
          value: curMl,
          options: marginLeftOptions,
          onChange: function onChange(v) {
            return apply(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, v);
          }
        }), /*#__PURE__*/React.createElement(CompactSelect, {
          label: "\u53F3",
          value: curMr,
          options: marginRightOptions,
          onChange: function onChange(v) {
            return apply(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, v);
          }
        })), /*#__PURE__*/React.createElement("div", {
          className: "lw-font-margin-row"
        }, /*#__PURE__*/React.createElement(CompactSelect, {
          label: "\u4E0B",
          value: curMb,
          options: marginBottomOptions,
          onChange: function onChange(v) {
            return apply(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, v);
          }
        })))), /*#__PURE__*/React.createElement("div", {
          className: "lw-font-control-section"
        }, /*#__PURE__*/React.createElement(SectionHeader, {
          title: "\u30C6\u30AD\u30B9\u30C8\u914D\u7F6E"
        }), /*#__PURE__*/React.createElement(ControlGrid, null, /*#__PURE__*/React.createElement(CompactSelect, {
          label: "PC",
          value: curCenterPc,
          options: centerOptions,
          onChange: function onChange(v) {
            return apply(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, v);
          }
        }), /*#__PURE__*/React.createElement(CompactSelect, {
          label: "\u30B9\u30DE\u30DB",
          value: curCenterSp,
          options: centerOptionsSp,
          onChange: function onChange(v) {
            return apply(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, v);
          }
        }))));
      } else if (tab.name === 'decoration') {
        return /*#__PURE__*/React.createElement("div", {
          className: "lw-font-tab-content"
        }, /*#__PURE__*/React.createElement("div", {
          className: "lw-font-control-section"
        }, /*#__PURE__*/React.createElement(SectionHeader, {
          title: "\u4E0B\u7DDA\u30B9\u30BF\u30A4\u30EB"
        }), /*#__PURE__*/React.createElement(SelectControl, {
          value: curUnderline,
          options: underlineOptions,
          onChange: function onChange(v) {
            return apply(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, v);
          }
        })), /*#__PURE__*/React.createElement("div", {
          className: "lw-font-control-section"
        }, /*#__PURE__*/React.createElement(SectionHeader, {
          title: "\u30C6\u30AD\u30B9\u30C8\u7E01\u53D6\u308A"
        }), /*#__PURE__*/React.createElement(ControlGrid, null, /*#__PURE__*/React.createElement(CompactSelect, {
          label: "PC",
          value: curOutPc,
          options: outlineOptionsPc,
          onChange: function onChange(v) {
            return apply(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, v);
          }
        }), /*#__PURE__*/React.createElement(CompactSelect, {
          label: "\u30B9\u30DE\u30DB",
          value: curOutSp,
          options: outlineOptionsSp,
          onChange: function onChange(v) {
            return apply(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, v);
          }
        })), /*#__PURE__*/React.createElement("div", {
          style: {
            marginTop: '10px'
          }
        }, /*#__PURE__*/React.createElement(SelectControl, {
          label: "\u7E01\u53D6\u308A\u8272",
          value: curOutCol,
          options: outlineOptionsColor,
          onChange: function onChange(v) {
            return apply(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, v);
          }
        }))));
      }
    }), /*#__PURE__*/React.createElement("div", {
      className: "lw-font-settings-footer"
    }, /*#__PURE__*/React.createElement(Button, {
      className: "lw-font-close-button",
      onClick: function onClick() {
        return setIsOpen(false);
      },
      isPrimary: true
    }, "\u9589\u3058\u308B"))));
  }
});
/******/ })()
;