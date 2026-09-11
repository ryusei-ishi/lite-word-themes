/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/affiliate-link.js":
/*!*******************************!*\
  !*** ./src/affiliate-link.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AffiliateToggle: () => (/* binding */ AffiliateToggle),
/* harmony export */   LW_AFFILIATE_REL: () => (/* binding */ LW_AFFILIATE_REL),
/* harmony export */   lwRel: () => (/* binding */ lwRel)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/**
 * LiteWord – アフィリエイトリンク（共通部品）
 * ------------------------------------------------------------
 *  Amazon・楽天などの広告リンクに、検索エンジン向けの印
 *  rel="sponsored nofollow" を付けるための共通部品。
 *
 *  なぜ要るか
 *  ・Google は「報酬が発生するリンクには rel="sponsored"（または nofollow）を付ける」
 *    ことを求めている。付けずに広告リンクを大量に置くと、リンクを売っているサイトと
 *    区別が付かず、検索順位を落とされることがある。
 *  ・ステマ規制（景品表示法・2023年10月〜）で必要なのは「広告である」という
 *    画面上の表示。rel はそれとは別（検索エンジン向け）なので、両方いる。
 *
 *  🚨 設計の前提（ここを崩すと既存ページが壊れる）
 *  ・約1000サイトに配るテーマなので、**既定値（オフ）のときの save の出力は
 *    1バイトも変えない**。lwRel() はオフのとき undefined を返し、React は
 *    属性ごと出力しない ＝ 今まで保存された HTML と完全に一致する。
 *    ＝ deprecated を書かなくてよい（reference/block-change-safety.md §0）。
 *  ・別タブの rel="noopener noreferrer" を今まで出していたブロックは、
 *    lwRel({ newTab, affiliate }) の形で呼ぶ。オフなら従来と同じ文字列になる。
 *  ・別タブでも rel を出していなかったブロック（lw-button-2 / 3）は
 *    lwRel({ affiliate }) だけを渡す。newTab を混ぜると出力が変わってしまう。
 */



/** 広告リンクに付ける rel の中身 */
var LW_AFFILIATE_REL = 'sponsored nofollow';

/**
 * a タグの rel を組み立てる。
 * 付けるものが何も無ければ undefined（＝属性そのものを出さない）。
 *
 * @param {Object}  opt
 * @param {boolean} opt.newTab    別タブで開く（従来どおり noopener noreferrer）
 * @param {boolean} opt.affiliate 広告リンク（sponsored nofollow）
 * @return {string|undefined} rel の値
 */
function lwRel() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    _ref$newTab = _ref.newTab,
    newTab = _ref$newTab === void 0 ? false : _ref$newTab,
    _ref$affiliate = _ref.affiliate,
    affiliate = _ref$affiliate === void 0 ? false : _ref$affiliate;
  var parts = [];
  if (newTab) {
    parts.push('noopener noreferrer');
  }
  if (affiliate) {
    parts.push(LW_AFFILIATE_REL);
  }
  return parts.length ? parts.join(' ') : undefined;
}

/**
 * 編集画面のトグル。
 * 「新しいタブで開く」のすぐ下に置く。
 *
 * @param {Object}   props
 * @param {boolean}  props.checked
 * @param {Function} props.onChange
 */
function AffiliateToggle(_ref2) {
  var checked = _ref2.checked,
    onChange = _ref2.onChange;
  return /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.ToggleControl, {
    label: "\u5E83\u544A\u30EA\u30F3\u30AF\uFF08\u30A2\u30D5\u30A3\u30EA\u30A8\u30A4\u30C8\uFF09",
    checked: !!checked,
    onChange: onChange,
    help: "Amazon\u30FB\u697D\u5929\u306A\u3069\u306E\u3001\u6210\u679C\u5831\u916C\u304C\u767A\u751F\u3059\u308B\u30EA\u30F3\u30AF\u306E\u3068\u304D\u306B\u30AA\u30F3\u306B\u3057\u307E\u3059\u3002\u691C\u7D22\u30A8\u30F3\u30B8\u30F3\u306B\u5E83\u544A\u3060\u3068\u4F1D\u3048\u308B\u5370\u304C\u4ED8\u304D\u307E\u3059\uFF08rel=\"sponsored nofollow\"\uFF09\u3002\u30AA\u30F3\u306B\u3059\u308B\u3068\u65B0\u3057\u3044\u30BF\u30D6\u3067\u958B\u304F\u8A2D\u5B9A\u3082\u4E00\u7DD2\u306B\u5165\u308A\u307E\u3059\u3002"
  });
}

/***/ }),

/***/ "./src/lw-pr-ranking-1/index.js":
/*!**************************************!*\
  !*** ./src/lw-pr-ranking-1/index.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils.js */ "./src/utils.js");
/* harmony import */ var _affiliate_link_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../affiliate-link.js */ "./src/affiliate-link.js");
/* harmony import */ var _parts_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./parts.js */ "./src/lw-pr-ranking-1/parts.js");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./style.scss */ "./src/lw-pr-ranking-1/style.scss");
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./editor.scss */ "./src/lw-pr-ranking-1/editor.scss");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./block.json */ "./src/lw-pr-ranking-1/block.json");
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
/**
 * ランキング 01（wdl/lw-pr-ranking-1）
 * ------------------------------------------------------------
 *  「おすすめ◯選」を、順位付きで縦に並べるブロック。
 *
 *  なぜ作ったか（2026-09-02）
 *  ・アフィリエイトの主力コンテンツは「おすすめ◯選」なのに、145ブロックの中に
 *    ランキング用のブロックが**1つも無かった**。
 *  ・実際、コスメ比較サイトのテンプレート（page_template/cosme/ranking_1）を作ったときは、
 *    見出し8個＋写真6枚＋表6個＋ボタン4個を**手で積んで**代用した。
 *    テンプレートを貼るだけの人はそれでよいが、**自分で4位を足したい人には無理**だった。
 *
 *  設計の芯
 *  ・**縦に1件ずつ**。横並びカードではない。ランキング記事は1件ごとに読ませるため。
 *  ・**並べた順がそのまま順位**。順位の数字を手で持たせない（入れ替えたときにズレる）。
 *  ・**良い点だけでなく「気になる点」を置く。** 良いことしか書いていないページは
 *    読む人にすぐ分かる。書ける場所をブロック側で用意しておく。
 *  ・広告リンクの体裁（rel="sponsored nofollow"・別タブ・PRの札）が既定で入っている。
 *  ・**外部APIを使わない**（商品リンク 01 と同じ理由。Amazon PA-API は売上実績が要る）。
 *
 *  🚨 商品画像は自分で撮った写真か、使用許諾のあるものだけ。
 */









var CLS = 'lw-pr-ranking-1';

/** 星（下に灰色・上に色つきを幅で切って重ねる）。編集画面と保存で同じものを出す */
var Stars = function Stars(_ref) {
  var percent = _ref.percent;
  return /*#__PURE__*/React.createElement("span", {
    className: "".concat(CLS, "__stars"),
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("span", {
    className: "".concat(CLS, "__stars-on"),
    style: {
      width: percent
    }
  }, "\u2605\u2605\u2605\u2605\u2605"), "\u2605\u2605\u2605\u2605\u2605");
};
var EMPTY_ITEM = {
  imageUrl: '',
  imageAlt: '',
  name: '商品名を入れてください',
  comment: '選んだ理由をひとことで書きます。',
  score: '4.0',
  good: '',
  bad: '',
  shops: [{
    label: 'Amazonで見る',
    url: '',
    bgColor: '#ff9900',
    textColor: '#ffffff'
  }, {
    label: '楽天市場で見る',
    url: '',
    bgColor: '#bf0000',
    textColor: '#ffffff'
  }, {
    label: 'Yahoo!で見る',
    url: '',
    bgColor: '#ff0033',
    textColor: '#ffffff'
  }]
};
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_8__.name, _objectSpread(_objectSpread({}, _block_json__WEBPACK_IMPORTED_MODULE_8__), {}, {
  edit: function edit(_ref2) {
    var attributes = _ref2.attributes,
      setAttributes = _ref2.setAttributes;
    var showPr = attributes.showPr,
      prText = attributes.prText,
      items = attributes.items,
      rankStyle = attributes.rankStyle,
      rankUnit = attributes.rankUnit,
      showScore = attributes.showScore,
      goodLabel = attributes.goodLabel,
      badLabel = attributes.badLabel,
      isAffiliate = attributes.isAffiliate,
      nameColor = attributes.nameColor,
      commentColor = attributes.commentColor,
      goodColor = attributes.goodColor,
      badColor = attributes.badColor,
      prBgColor = attributes.prBgColor,
      prTextColor = attributes.prTextColor,
      rankTextColor = attributes.rankTextColor,
      buttonRadius = attributes.buttonRadius,
      FontSet = attributes.FontSet;
    var list = items || [];
    var setItem = function setItem(i, key, value) {
      setAttributes({
        items: list.map(function (it, k) {
          return k === i ? _objectSpread(_objectSpread({}, it), {}, _defineProperty({}, key, value)) : it;
        })
      });
    };
    var setShop = function setShop(i, s, key, value) {
      setAttributes({
        items: list.map(function (it, k) {
          if (k !== i) {
            return it;
          }
          var shops = (it.shops || []).map(function (sh, m) {
            return m === s ? _objectSpread(_objectSpread({}, sh), {}, _defineProperty({}, key, value)) : sh;
          });
          return _objectSpread(_objectSpread({}, it), {}, {
            shops: shops
          });
        })
      });
    };
    var moveItem = function moveItem(i, dir) {
      var j = i + dir;
      if (j < 0 || j >= list.length) {
        return;
      }
      var next = list.slice();
      var tmp = next[i];
      next[i] = next[j];
      next[j] = tmp;
      setAttributes({
        items: next
      });
    };
    var addItem = function addItem() {
      return setAttributes({
        items: [].concat(_toConsumableArray(list), [JSON.parse(JSON.stringify(EMPTY_ITEM))])
      });
    };
    var removeItem = function removeItem(i) {
      return setAttributes({
        items: list.filter(function (_, k) {
          return k !== i;
        })
      });
    };
    var blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
      className: CLS,
      style: (0,_parts_js__WEBPACK_IMPORTED_MODULE_5__.blockVars)(attributes)
    });
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u8868\u793A\u306E\u8A2D\u5B9A",
      initialOpen: true
    }, /*#__PURE__*/React.createElement(_affiliate_link_js__WEBPACK_IMPORTED_MODULE_4__.AffiliateToggle, {
      checked: attributes.isAffiliate,
      onChange: function onChange(v) {
        return setAttributes({
          isAffiliate: v
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      label: "\u300CPR\u300D\u306E\u672D\u3092\u51FA\u3059",
      help: "\u5E83\u544A\u3067\u3042\u308B\u3053\u3068\u306E\u8868\u793A\u3067\u3059\u3002\u30A2\u30D5\u30A3\u30EA\u30A8\u30A4\u30C8\u30EA\u30F3\u30AF\u3092\u7F6E\u304F\u306A\u3089\u6D88\u3055\u306A\u3044\u3067\u304F\u3060\u3055\u3044\uFF08\u666F\u54C1\u8868\u793A\u6CD5\uFF09\u3002",
      checked: showPr,
      onChange: function onChange(v) {
        return setAttributes({
          showPr: v
        });
      }
    }), showPr && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
      label: "\u672D\u306E\u6587\u5B57",
      value: prText,
      onChange: function onChange(v) {
        return setAttributes({
          prText: v
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: "\u9806\u4F4D\u306E\u898B\u305B\u65B9",
      value: rankStyle,
      options: [{
        label: 'メダル（1〜3位）',
        value: 'medal'
      }, {
        label: '数字だけ（1位・2位…）',
        value: 'number'
      }, {
        label: '順位を出さない',
        value: 'none'
      }],
      onChange: function onChange(v) {
        return setAttributes({
          rankStyle: v
        });
      }
    }), rankStyle === 'number' && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
      label: "\u9806\u4F4D\u306E\u5358\u4F4D",
      value: rankUnit,
      onChange: function onChange(v) {
        return setAttributes({
          rankUnit: v
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      label: "\u8A55\u4FA1\uFF08\u661F\uFF09\u3092\u51FA\u3059",
      checked: showScore,
      onChange: function onChange(v) {
        return setAttributes({
          showScore: v
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
      label: "\u826F\u3044\u70B9\u306E\u898B\u51FA\u3057",
      value: goodLabel,
      onChange: function onChange(v) {
        return setAttributes({
          goodLabel: v
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
      label: "\u6C17\u306B\u306A\u308B\u70B9\u306E\u898B\u51FA\u3057",
      value: badLabel,
      onChange: function onChange(v) {
        return setAttributes({
          badLabel: v
        });
      }
    })), list.map(function (item, i) {
      return /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        key: i,
        title: "".concat(i + 1, "\u4F4D  ").concat(String(item.name || '').replace(/<[^>]*>/g, '').slice(0, 12)),
        initialOpen: false
      }, /*#__PURE__*/React.createElement("div", {
        className: "".concat(CLS, "__ed-order")
      }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
        variant: "secondary",
        disabled: i === 0,
        onClick: function onClick() {
          return moveItem(i, -1);
        }
      }, "\u2191 \u4E0A\u3078"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
        variant: "secondary",
        disabled: i === list.length - 1,
        onClick: function onClick() {
          return moveItem(i, 1);
        }
      }, "\u2193 \u4E0B\u3078"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
        isDestructive: true,
        onClick: function onClick() {
          return removeItem(i);
        }
      }, "\u524A\u9664")), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
        onSelect: function onSelect(m) {
          return setItem(i, 'imageUrl', m.url);
        },
        allowedTypes: ['image'],
        render: function render(_ref3) {
          var open = _ref3.open;
          return /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
            variant: "secondary",
            onClick: open
          }, item.imageUrl ? '画像を変える' : '画像を選ぶ');
        }
      }), item.imageUrl && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
        isDestructive: true,
        variant: "tertiary",
        onClick: function onClick() {
          return setItem(i, 'imageUrl', '');
        }
      }, "\u753B\u50CF\u3092\u5916\u3059"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
        label: "\u753B\u50CF\u306E\u8AAC\u660E\uFF08alt\uFF09",
        value: item.imageAlt || '',
        onChange: function onChange(v) {
          return setItem(i, 'imageAlt', v);
        }
      }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
        label: "\u8A55\u4FA1\uFF080\u301C5\uFF09",
        help: "\u7A7A\u306B\u3059\u308B\u3068\u661F\u3082\u6570\u5B57\u3082\u51FA\u307E\u305B\u3093\u3002",
        value: item.score || '',
        onChange: function onChange(v) {
          return setItem(i, 'score', v);
        }
      }), (item.shops || []).map(function (sh, s) {
        return /*#__PURE__*/React.createElement("div", {
          key: s,
          className: "".concat(CLS, "__ed-shop")
        }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
          label: "\u304A\u5E97 ".concat(s + 1, " \u306E\u30DC\u30BF\u30F3\u540D"),
          value: sh.label || '',
          onChange: function onChange(v) {
            return setShop(i, s, 'label', v);
          }
        }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
          label: "\u30EA\u30F3\u30AF\u5148\uFF08\u7A7A\u306A\u3089\u30DC\u30BF\u30F3\u306F\u51FA\u307E\u305B\u3093\uFF09",
          value: sh.url || '',
          onChange: function onChange(v) {
            return setShop(i, s, 'url', v);
          }
        }));
      }));
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u5927\u304D\u3055\u30FB\u4F59\u767D",
      initialOpen: false
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u5168\u4F53\u306E\u6700\u5927\u5E45",
      min: 320,
      max: 1200,
      value: attributes.maxWidth,
      onChange: function onChange(v) {
        return setAttributes({
          maxWidth: v
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "1\u4EF6\u3054\u3068\u306E\u9593\u9694",
      min: 0,
      max: 80,
      value: attributes.itemGap,
      onChange: function onChange(v) {
        return setAttributes({
          itemGap: v
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u753B\u50CF\u306E\u5E45\uFF08PC\uFF09",
      min: 80,
      max: 360,
      value: attributes.imageWidth,
      onChange: function onChange(v) {
        return setAttributes({
          imageWidth: v
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u753B\u50CF\u306E\u5E45\uFF08\u30B9\u30DE\u30DB\uFF09",
      min: 60,
      max: 240,
      value: attributes.imageWidthSp,
      onChange: function onChange(v) {
        return setAttributes({
          imageWidthSp: v
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u5546\u54C1\u540D\u306E\u5927\u304D\u3055\uFF08PC\uFF09",
      min: 12,
      max: 32,
      value: attributes.nameFontSize,
      onChange: function onChange(v) {
        return setAttributes({
          nameFontSize: v
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u5546\u54C1\u540D\u306E\u5927\u304D\u3055\uFF08\u30B9\u30DE\u30DB\uFF09",
      min: 12,
      max: 28,
      value: attributes.nameFontSizeSp,
      onChange: function onChange(v) {
        return setAttributes({
          nameFontSizeSp: v
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u4E0A\u306E\u4F59\u767D",
      min: 0,
      max: 120,
      value: attributes.marginTop,
      onChange: function onChange(v) {
        return setAttributes({
          marginTop: v
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u4E0B\u306E\u4F59\u767D",
      min: 0,
      max: 120,
      value: attributes.marginBottom,
      onChange: function onChange(v) {
        return setAttributes({
          marginBottom: v
        });
      }
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30DC\u30BF\u30F3",
      initialOpen: false
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u6A2A\u306B\u4E26\u3079\u308B\u6570\uFF08PC\uFF09",
      min: 1,
      max: 4,
      value: attributes.buttonColumnsPc,
      onChange: function onChange(v) {
        return setAttributes({
          buttonColumnsPc: v
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u6A2A\u306B\u4E26\u3079\u308B\u6570\uFF08\u30B9\u30DE\u30DB\uFF09",
      min: 1,
      max: 3,
      value: attributes.buttonColumnsSp,
      onChange: function onChange(v) {
        return setAttributes({
          buttonColumnsSp: v
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u89D2\u306E\u4E38\u307F",
      min: 0,
      max: 40,
      value: attributes.buttonRadius,
      onChange: function onChange(v) {
        return setAttributes({
          buttonRadius: v
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u6587\u5B57\u306E\u5927\u304D\u3055",
      min: 11,
      max: 22,
      value: attributes.buttonFontSize,
      onChange: function onChange(v) {
        return setAttributes({
          buttonFontSize: v
        });
      }
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u8272",
      initialOpen: false
    }, /*#__PURE__*/React.createElement("p", null, "\u5546\u54C1\u540D"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      value: nameColor,
      onChange: function onChange(v) {
        return setAttributes({
          nameColor: v || '#222222'
        });
      }
    }), /*#__PURE__*/React.createElement("p", null, "\u3072\u3068\u3053\u3068"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      value: commentColor,
      onChange: function onChange(v) {
        return setAttributes({
          commentColor: v || '#666666'
        });
      }
    }), /*#__PURE__*/React.createElement("p", null, "\u8A55\u4FA1\u306E\u661F"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      value: attributes.scoreColor,
      onChange: function onChange(v) {
        return setAttributes({
          scoreColor: v || '#f0a020'
        });
      }
    }), /*#__PURE__*/React.createElement("p", null, "\u826F\u3044\u70B9"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      value: goodColor,
      onChange: function onChange(v) {
        return setAttributes({
          goodColor: v || '#1f7a4d'
        });
      }
    }), /*#__PURE__*/React.createElement("p", null, "\u6C17\u306B\u306A\u308B\u70B9"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      value: badColor,
      onChange: function onChange(v) {
        return setAttributes({
          badColor: v || '#9c5a5a'
        });
      }
    }), /*#__PURE__*/React.createElement("p", null, "\u7BB1\u306E\u80CC\u666F"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      value: attributes.boxBgColor,
      onChange: function onChange(v) {
        return setAttributes({
          boxBgColor: v || '#ffffff'
        });
      }
    }), /*#__PURE__*/React.createElement("p", null, "\u7BB1\u306E\u67A0"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      value: attributes.boxBorderColor,
      onChange: function onChange(v) {
        return setAttributes({
          boxBorderColor: v || '#e5e5e5'
        });
      }
    }), /*#__PURE__*/React.createElement("p", null, "1\u4F4D\u306E\u672D"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      value: attributes.rank1Color,
      onChange: function onChange(v) {
        return setAttributes({
          rank1Color: v || '#c9a227'
        });
      }
    }), /*#__PURE__*/React.createElement("p", null, "2\u4F4D\u306E\u672D"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      value: attributes.rank2Color,
      onChange: function onChange(v) {
        return setAttributes({
          rank2Color: v || '#98a2ad'
        });
      }
    }), /*#__PURE__*/React.createElement("p", null, "3\u4F4D\u306E\u672D"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      value: attributes.rank3Color,
      onChange: function onChange(v) {
        return setAttributes({
          rank3Color: v || '#b0763c'
        });
      }
    }), /*#__PURE__*/React.createElement("p", null, "4\u4F4D\u4EE5\u4E0B\u306E\u672D"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      value: attributes.rankOtherColor,
      onChange: function onChange(v) {
        return setAttributes({
          rankOtherColor: v || '#8a8a8a'
        });
      }
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30D5\u30A9\u30F3\u30C8",
      initialOpen: false
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: "\u30D5\u30A9\u30F3\u30C8",
      value: FontSet,
      options: (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.fontOptionsArr)(),
      onChange: function onChange(v) {
        return setAttributes({
          FontSet: v
        });
      }
    }))), /*#__PURE__*/React.createElement("div", blockProps, showPr && /*#__PURE__*/React.createElement("p", {
      className: "".concat(CLS, "__pr"),
      style: {
        backgroundColor: prBgColor,
        color: prTextColor
      }
    }, prText), list.map(function (item, i) {
      var shops = (0,_parts_js__WEBPACK_IMPORTED_MODULE_5__.visibleShops)(item);
      var percent = (0,_parts_js__WEBPACK_IMPORTED_MODULE_5__.starPercent)(item.score);
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        className: "".concat(CLS, "__item"),
        style: (0,_parts_js__WEBPACK_IMPORTED_MODULE_5__.boxStyle)(attributes)
      }, rankStyle !== 'none' && /*#__PURE__*/React.createElement("span", {
        className: "".concat(CLS, "__rank"),
        style: {
          backgroundColor: (0,_parts_js__WEBPACK_IMPORTED_MODULE_5__.rankColor)(attributes, i),
          color: rankTextColor
        }
      }, (0,_parts_js__WEBPACK_IMPORTED_MODULE_5__.rankLabel)(attributes, i)), /*#__PURE__*/React.createElement("div", {
        className: "".concat(CLS, "__main")
      }, item.imageUrl && /*#__PURE__*/React.createElement("div", {
        className: "".concat(CLS, "__img")
      }, /*#__PURE__*/React.createElement("img", {
        src: item.imageUrl,
        alt: item.imageAlt || ''
      })), /*#__PURE__*/React.createElement("div", {
        className: "".concat(CLS, "__body")
      }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
        tagName: "p",
        className: "".concat(CLS, "__name"),
        value: item.name,
        onChange: function onChange(v) {
          return setItem(i, 'name', v);
        },
        placeholder: "\u5546\u54C1\u540D",
        style: {
          color: nameColor
        },
        "data-lw_font_set": FontSet
      }), showScore && percent && /*#__PURE__*/React.createElement("p", {
        className: "".concat(CLS, "__score")
      }, /*#__PURE__*/React.createElement(Stars, {
        percent: percent
      }), /*#__PURE__*/React.createElement("span", {
        className: "".concat(CLS, "__score-num")
      }, item.score)), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
        tagName: "p",
        className: "".concat(CLS, "__comment"),
        value: item.comment,
        onChange: function onChange(v) {
          return setItem(i, 'comment', v);
        },
        placeholder: "\u9078\u3093\u3060\u7406\u7531\u3092\u3072\u3068\u3053\u3068\u3067",
        style: {
          color: commentColor
        }
      }), /*#__PURE__*/React.createElement("ul", {
        className: "".concat(CLS, "__points")
      }, /*#__PURE__*/React.createElement("li", {
        className: "is-good"
      }, /*#__PURE__*/React.createElement("span", {
        className: "".concat(CLS, "__label"),
        style: {
          color: goodColor
        }
      }, goodLabel), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
        tagName: "span",
        value: item.good,
        onChange: function onChange(v) {
          return setItem(i, 'good', v);
        },
        placeholder: "\u826F\u304B\u3063\u305F\u70B9"
      })), /*#__PURE__*/React.createElement("li", {
        className: "is-bad"
      }, /*#__PURE__*/React.createElement("span", {
        className: "".concat(CLS, "__label"),
        style: {
          color: badColor
        }
      }, badLabel), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
        tagName: "span",
        value: item.bad,
        onChange: function onChange(v) {
          return setItem(i, 'bad', v);
        },
        placeholder: "\u6C17\u306B\u306A\u3063\u305F\u70B9\uFF08\u6B63\u76F4\u306B\u66F8\u304F\u307B\u3069\u4FE1\u7528\u3055\u308C\u307E\u3059\uFF09"
      }))))), !!shops.length && /*#__PURE__*/React.createElement("div", {
        className: "".concat(CLS, "__shops"),
        style: (0,_parts_js__WEBPACK_IMPORTED_MODULE_5__.shopsStyle)(attributes, shops.length)
      }, shops.map(function (s, k) {
        return /*#__PURE__*/React.createElement("span", {
          key: k,
          className: "".concat(CLS, "__shop"),
          style: {
            backgroundColor: s.bgColor,
            color: s.textColor,
            borderRadius: "".concat(buttonRadius, "px")
          },
          "data-lw_font_set": FontSet
        }, s.label);
      })));
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
      variant: "secondary",
      className: "".concat(CLS, "__ed-add"),
      onClick: addItem
    }, "\uFF0B \u9806\u4F4D\u3092\u8FFD\u52A0")));
  },
  save: function save(_ref4) {
    var attributes = _ref4.attributes;
    var showPr = attributes.showPr,
      prText = attributes.prText,
      items = attributes.items,
      rankStyle = attributes.rankStyle,
      showScore = attributes.showScore,
      goodLabel = attributes.goodLabel,
      badLabel = attributes.badLabel,
      isAffiliate = attributes.isAffiliate,
      nameColor = attributes.nameColor,
      commentColor = attributes.commentColor,
      goodColor = attributes.goodColor,
      badColor = attributes.badColor,
      prBgColor = attributes.prBgColor,
      prTextColor = attributes.prTextColor,
      rankTextColor = attributes.rankTextColor,
      buttonRadius = attributes.buttonRadius,
      FontSet = attributes.FontSet;
    var list = items || [];
    var blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save({
      className: CLS,
      style: (0,_parts_js__WEBPACK_IMPORTED_MODULE_5__.blockVars)(attributes)
    });
    return /*#__PURE__*/React.createElement("div", blockProps, showPr && /*#__PURE__*/React.createElement("p", {
      className: "".concat(CLS, "__pr"),
      style: {
        backgroundColor: prBgColor,
        color: prTextColor
      }
    }, prText), list.map(function (item, i) {
      var shops = (0,_parts_js__WEBPACK_IMPORTED_MODULE_5__.visibleShops)(item);
      var percent = (0,_parts_js__WEBPACK_IMPORTED_MODULE_5__.starPercent)(item.score);
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        className: "".concat(CLS, "__item"),
        style: (0,_parts_js__WEBPACK_IMPORTED_MODULE_5__.boxStyle)(attributes)
      }, rankStyle !== 'none' && /*#__PURE__*/React.createElement("span", {
        className: "".concat(CLS, "__rank"),
        style: {
          backgroundColor: (0,_parts_js__WEBPACK_IMPORTED_MODULE_5__.rankColor)(attributes, i),
          color: rankTextColor
        }
      }, (0,_parts_js__WEBPACK_IMPORTED_MODULE_5__.rankLabel)(attributes, i)), /*#__PURE__*/React.createElement("div", {
        className: "".concat(CLS, "__main")
      }, item.imageUrl && /*#__PURE__*/React.createElement("div", {
        className: "".concat(CLS, "__img")
      }, /*#__PURE__*/React.createElement("img", {
        src: item.imageUrl,
        alt: item.imageAlt || ''
      })), /*#__PURE__*/React.createElement("div", {
        className: "".concat(CLS, "__body")
      }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
        tagName: "p",
        className: "".concat(CLS, "__name"),
        value: item.name,
        style: {
          color: nameColor
        },
        "data-lw_font_set": FontSet
      }), showScore && percent && /*#__PURE__*/React.createElement("p", {
        className: "".concat(CLS, "__score")
      }, /*#__PURE__*/React.createElement(Stars, {
        percent: percent
      }), /*#__PURE__*/React.createElement("span", {
        className: "".concat(CLS, "__score-num")
      }, item.score)), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
        tagName: "p",
        className: "".concat(CLS, "__comment"),
        value: item.comment,
        style: {
          color: commentColor
        }
      }), ((0,_parts_js__WEBPACK_IMPORTED_MODULE_5__.hasText)(item.good) || (0,_parts_js__WEBPACK_IMPORTED_MODULE_5__.hasText)(item.bad)) && /*#__PURE__*/React.createElement("ul", {
        className: "".concat(CLS, "__points")
      }, (0,_parts_js__WEBPACK_IMPORTED_MODULE_5__.hasText)(item.good) && /*#__PURE__*/React.createElement("li", {
        className: "is-good"
      }, /*#__PURE__*/React.createElement("span", {
        className: "".concat(CLS, "__label"),
        style: {
          color: goodColor
        }
      }, goodLabel), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
        tagName: "span",
        value: item.good
      })), (0,_parts_js__WEBPACK_IMPORTED_MODULE_5__.hasText)(item.bad) && /*#__PURE__*/React.createElement("li", {
        className: "is-bad"
      }, /*#__PURE__*/React.createElement("span", {
        className: "".concat(CLS, "__label"),
        style: {
          color: badColor
        }
      }, badLabel), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
        tagName: "span",
        value: item.bad
      }))))), !!shops.length && /*#__PURE__*/React.createElement("div", {
        className: "".concat(CLS, "__shops"),
        style: (0,_parts_js__WEBPACK_IMPORTED_MODULE_5__.shopsStyle)(attributes, shops.length)
      }, shops.map(function (s, k) {
        return /*#__PURE__*/React.createElement("a", {
          key: k,
          className: "".concat(CLS, "__shop"),
          href: s.url,
          target: isAffiliate ? '_blank' : undefined,
          rel: (0,_affiliate_link_js__WEBPACK_IMPORTED_MODULE_4__.lwRel)({
            newTab: isAffiliate,
            affiliate: isAffiliate
          }),
          style: {
            backgroundColor: s.bgColor,
            color: s.textColor,
            borderRadius: "".concat(buttonRadius, "px")
          },
          "data-lw_font_set": FontSet
        }, s.label);
      })));
    }));
  }
}));

/***/ }),

/***/ "./src/lw-pr-ranking-1/parts.js":
/*!**************************************!*\
  !*** ./src/lw-pr-ranking-1/parts.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   blockVars: () => (/* binding */ blockVars),
/* harmony export */   boxStyle: () => (/* binding */ boxStyle),
/* harmony export */   hasText: () => (/* binding */ hasText),
/* harmony export */   rankColor: () => (/* binding */ rankColor),
/* harmony export */   rankLabel: () => (/* binding */ rankLabel),
/* harmony export */   shopsStyle: () => (/* binding */ shopsStyle),
/* harmony export */   starPercent: () => (/* binding */ starPercent),
/* harmony export */   visibleShops: () => (/* binding */ visibleShops)
/* harmony export */ });
/**
 * ランキング 01 の共通部品（編集画面と保存の両方から使う）
 * ---------------------------------------------------------
 * ここに置く理由は、**編集画面と保存で計算がずれないようにするため**。
 * 片方だけ直すと save の出力が変わり、既存ページが「ブロックが壊れています」になる。
 */

/** 順位の札の色（1位=金・2位=銀・3位=銅・4位以下=灰） */
function rankColor(a, index) {
  if (index === 0) {
    return a.rank1Color;
  }
  if (index === 1) {
    return a.rank2Color;
  }
  if (index === 2) {
    return a.rank3Color;
  }
  return a.rankOtherColor;
}

/** 順位の札に出す文字（メダル／数字／出さない） */
function rankLabel(a, index) {
  if (a.rankStyle === 'none') {
    return '';
  }
  /* メダルだけだと色つきの札の上で潰れて読めない（2026-09-02・実際にそう見えた）。
     メダルは添えるだけにして、順位は数字で読ませる。 */
  if (a.rankStyle === 'medal' && index < 3) {
    var medal = ["\uD83E\uDD47", "\uD83E\uDD48", "\uD83E\uDD49"][index];
    return "".concat(medal).concat(index + 1).concat(a.rankUnit || '');
  }
  return "".concat(index + 1).concat(a.rankUnit || '');
}

/**
 * 星の塗り幅（％）。0〜5 の評価を長さに直す。
 * 文字の星を重ねて、上の色つきの星をこの幅で切る（半分の星も出せる）。
 * ⚠️ 単位（%）が付くので、ここは数値で渡しても React が px を付ける心配はない。
 *    それでも文字列で返して、扱いを他の変数とそろえておく。
 *
 * 🚨 小数第1位で丸める。丸めないと 4.4 が 88.00000000000001% になる
 *    （2進小数の誤差。0〜5 を 0.1 刻みで見ると 50 通り中 11 通りで出る）。
 *    見た目は同じでも、この値は保存される HTML に入る。
 *    **公開したあとに丸め方を変えると、それまでに保存された全ページが
 *    「ブロックが壊れています」になる。** ここは公開前にしか直せない。
 *    2026-09-02、公開前に直した。
 */
function starPercent(score) {
  var n = parseFloat(score);
  if (!isFinite(n) || n <= 0) {
    return null;
  }
  var pct = Math.max(0, Math.min(100, n / 5 * 100));
  return "".concat(Math.round(pct * 10) / 10, "%");
}

/**
 * RichText の値に、目に見える中身があるか。
 *
 * 🚨 空文字だけでなく、`<br>` や `&nbsp;` だけの状態も「無い」と見る。
 *    RichText は消しきったつもりでも空タグが残ることがあり、
 *    素の `if ( item.good )` では拾えない。
 * 🚨 編集画面と保存の両方から必ずこの関数を使うこと。
 *    判定がずれると save の出力が変わり、既存ページが「壊れています」になる。
 */
function hasText(value) {
  if (value === undefined || value === null) {
    return false;
  }
  return String(value).replace(/<[^>]*>/g, '').replace(/&nbsp;| /g, ' ').trim() !== '';
}

/** アドレスの入っているお店だけ返す（空の店はボタンごと出さない） */
function visibleShops(item) {
  return (item && item.shops || []).filter(function (s) {
    return s && s.url;
  });
}

/**
 * ブロック全体に渡す CSS 変数。
 *
 * 🚨🚨 **単位のない値は必ず文字列で渡すこと。**
 *    React は style に数値を渡されると px を付ける（カスタムプロパティも例外ではない）。
 *    `3` を渡すと `--rk1-btn-col:3px` になり `repeat(3px, 1fr)` ＝ 丸ごと無効で1列に潰れる。
 *    2026-09-02 に商品リンク 01 で実際に踏んだ。**プレビューでは気づけない。**
 *    検査 → scripts/fv-samples/check-cssvar-px.js
 */
function blockVars(a) {
  return {
    marginTop: "".concat(a.marginTop, "px"),
    marginBottom: "".concat(a.marginBottom, "px"),
    '--rk1-max-width': "".concat(a.maxWidth, "px"),
    '--rk1-gap': "".concat(a.itemGap, "px"),
    '--rk1-img-w': "".concat(a.imageWidth, "px"),
    '--rk1-img-w-sp': "".concat(a.imageWidthSp, "px"),
    '--rk1-name-size': "".concat(a.nameFontSize, "px"),
    '--rk1-name-size-sp': "".concat(a.nameFontSizeSp, "px"),
    '--rk1-btn-size': "".concat(a.buttonFontSize, "px"),
    '--rk1-score-color': a.scoreColor
  };
}

/** 1件ごとの箱の見た目 */
function boxStyle(a) {
  return {
    backgroundColor: a.boxBgColor,
    borderColor: a.boxBorderColor,
    borderWidth: "".concat(a.boxBorderWidth, "px"),
    borderRadius: "".concat(a.borderRadius, "px")
  };
}

/**
 * お店のボタンの列数。**出るボタンの数で頭打ちにする。**
 * 3列のまま1本だけ出すと、箱の3分の1幅でぽつんと残って貧相に見える。
 * 🚨 ここも String() を外さないこと（上の px の話）。
 */
function shopsStyle(a, count) {
  var n = Math.max(count || 0, 1);
  return {
    '--rk1-btn-col': String(Math.min(a.buttonColumnsPc, n)),
    '--rk1-btn-col-sp': String(Math.min(a.buttonColumnsSp, n))
  };
}

/***/ }),

/***/ "./src/utils.js":
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ButtonBackgroundOptionsArr: () => (/* binding */ ButtonBackgroundOptionsArr),
/* harmony export */   fontOptionsArr: () => (/* binding */ fontOptionsArr),
/* harmony export */   fontWeightClassOptionArr: () => (/* binding */ fontWeightClassOptionArr),
/* harmony export */   fontWeightOptionsArr: () => (/* binding */ fontWeightOptionsArr),
/* harmony export */   leftButtonIconSvgArr: () => (/* binding */ leftButtonIconSvgArr),
/* harmony export */   minHeightPcClassOptionArr: () => (/* binding */ minHeightPcClassOptionArr),
/* harmony export */   minHeightSpClassOptionArr: () => (/* binding */ minHeightSpClassOptionArr),
/* harmony export */   minHeightTbClassOptionArr: () => (/* binding */ minHeightTbClassOptionArr),
/* harmony export */   rightButtonIconSvgArr: () => (/* binding */ rightButtonIconSvgArr),
/* harmony export */   serviceInfoIconSvgArr: () => (/* binding */ serviceInfoIconSvgArr)
/* harmony export */ });
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
//高さ調整の関数 ---------------------

// 共通のヘッダーオフセット値
var HEADER_OFFSETS = [0, 20, 40, 60, 80, 100];

// デバイスごとの高さの値を定義
var HEIGHT_VALUES = {
  pc: [768, 720, 680, 640, 600, 580, 560, 540, 520, 500, 480, 460, 440, 420, 400, 380, 360, 340, 320, 300, 280, 260, 240, 220, 200, 180, 160, 140],
  tb: [768, 600, 580, 560, 540, 520, 500, 480, 460, 440, 420, 400, 380, 360, 340, 320, 300, 280, 260, 240, 220, 200, 180, 160, 140],
  sp: [600, 580, 560, 540, 520, 500, 480, 460, 440, 420, 400, 380, 360, 340, 320, 300, 280, 260, 240, 220, 200, 180, 160, 140]
};

// 汎用的な高さオプション生成関数
function generateHeightOptions(device) {
  var includeHeader = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var prefix = "min-h-".concat(device);
  var heightValues = HEIGHT_VALUES[device];

  // 基本オプション
  var baseOptions = [{
    label: '未選択',
    value: ''
  }, {
    label: '画面の高さ',
    value: "".concat(prefix, "-100vh")
  }];

  // 数値高さオプション（タイプミスも修正: 520px の大文字Pを小文字に）
  var numericOptions = heightValues.map(function (value) {
    return {
      label: "".concat(value, "px"),
      value: "".concat(prefix, "-").concat(value, "px")
    };
  });

  // ヘッダーなしの場合
  if (!includeHeader) {
    return [].concat(baseOptions, _toConsumableArray(numericOptions));
  }

  // ヘッダー関連オプション
  var headerOptions = HEADER_OFFSETS.map(function (offset) {
    return {
      label: offset === 0 ? '画面の高さ - ヘッダーの高さ' : "\u753B\u9762\u306E\u9AD8\u3055 - \u30D8\u30C3\u30C0\u30FC\u306E\u9AD8\u3055 - ".concat(offset, "px"),
      value: offset === 0 ? "".concat(prefix, "-100vh-header") : "".concat(prefix, "-100vh-header-").concat(offset)
    };
  });
  return [].concat(baseOptions, _toConsumableArray(headerOptions), _toConsumableArray(numericOptions));
}

// PC用高さオプション
function minHeightPcClassOptionArr() {
  var $ptn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  return generateHeightOptions('pc', $ptn !== "none_header");
}

// タブレット用高さオプション
function minHeightTbClassOptionArr() {
  var $ptn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  return generateHeightOptions('tb', $ptn !== "none_header");
}

// スマートフォン用高さオプション
function minHeightSpClassOptionArr() {
  var $ptn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  return generateHeightOptions('sp', $ptn !== "none_header");
}
// 使用例：
// const pcOptions = minHeightPcClassOptionArr();              // ヘッダーオプション含む
// const pcOptionsNoHeader = minHeightPcClassOptionArr("none_header"); // ヘッダーオプションなし
// const tbOptions = minHeightTbClassOptionArr();              // ヘッダーオプション含む
// const spOptions = minHeightSpClassOptionArr("none_header"); // ヘッダーオプションなし

//フォント系 ---------------------
// フォントオプションを変数に定義
function fontOptionsArr() {
  return [{
    label: '未選択',
    value: ''
  }, {
    label: '明朝体',
    value: 'mincho'
  }, {
    label: 'ゴシック',
    value: 'gothic'
  }, {
    label: 'Noto Sans JP',
    value: 'Noto Sans JP'
  }, {
    label: 'Noto Serif JP',
    value: 'Noto Serif JP'
  }, {
    label: 'M PLUS Rounded 1c',
    value: 'M PLUS Rounded 1c'
  }, {
    label: 'Kosugi Maru',
    value: 'Kosugi Maru'
  }, {
    label: 'Sawarabi Mincho',
    value: 'Sawarabi Mincho'
  }, {
    label: 'Sawarabi Gothic',
    value: 'Sawarabi Gothic'
  }, {
    label: 'Murecho',
    value: 'Murecho'
  }, {
    label: 'IBM Plex Sans JP',
    value: 'IBM Plex Sans JP'
  }, {
    label: 'BIZ UDPGothic',
    value: 'BIZ UDPGothic'
  }, {
    label: 'Roboto',
    value: 'Roboto'
  }, {
    label: 'sora',
    value: 'sora'
  }, {
    label: 'Lato',
    value: 'Lato'
  }, {
    label: 'Josefin Sans',
    value: 'Josefin Sans'
  }];
}
// フォント太さオプションを変数に定義
function fontWeightOptionsArr() {
  return [{
    label: '未選択',
    value: ''
  }, {
    label: '100 (Thin)',
    value: '100'
  }, {
    label: '300 (Light)',
    value: '300'
  }, {
    label: '400 (Normal)',
    value: '400'
  }, {
    label: '500 (Medium)',
    value: '500'
  }, {
    label: '600 (Semi-Bold)',
    value: '600'
  }, {
    label: '700 (Bold)',
    value: '700'
  }, {
    label: '800 (Extra-Bold)',
    value: '800'
  }, {
    label: '900 (Black)',
    value: '900'
  }];
}
// フォント太さオプションを変数に定義
function fontWeightClassOptionArr() {
  return [{
    label: '100 (Thin)',
    value: 'font-weight-100'
  }, {
    label: '200 (Extra Light)',
    value: 'font-weight-200'
  }, {
    label: '300 (Light)',
    value: 'font-weight-300'
  }, {
    label: '400 (Normal)',
    value: 'font-weight-400'
  }, {
    label: '500 (Medium)',
    value: 'font-weight-500'
  }, {
    label: '600 (Semi Bold)',
    value: 'font-weight-600'
  }, {
    label: '700 (Bold)',
    value: 'font-weight-700'
  }, {
    label: '800 (Extra Bold)',
    value: 'font-weight-800'
  }, {
    label: '900 (Black)',
    value: 'font-weight-900'
  }];
}
// 背景オプションを変数に定義
function ButtonBackgroundOptionsArr() {
  return [{
    label: '未選択',
    value: ''
  }, {
    label: 'メインカラー',
    value: 'var(--color-main)'
  }, {
    label: 'アクセントカラー',
    value: 'var(--color-accent)'
  }, {
    label: 'エメラルドグリーン',
    value: 'linear-gradient(90deg, rgba(0,186,157,1) 0%, rgba(16,201,151,1) 33%, rgba(16,201,151,1) 69%, rgba(0,186,157,1) 100%)'
  }, {
    label: '紫とピンク',
    value: 'linear-gradient(90deg, rgba(125,57,242,1) 0%, rgba(153,102,255,1) 33%, rgba(153,102,255,1) 69%, rgba(125,57,242,1) 100%)'
  }, {
    label: '青とシアン',
    value: 'linear-gradient(90deg, rgba(0,132,255,1) 0%, rgba(0,184,255,1) 33%, rgba(0,184,255,1) 69%, rgba(0,132,255,1) 100%)'
  }, {
    label: '濃い青とシアン',
    value: 'linear-gradient(90deg, rgba(0,85,200,1) 0%, rgba(0,120,200,1) 33%, rgba(0,120,200,1) 69%, rgba(0,85,200,1) 100%)'
  }, {
    label: 'オレンジと赤',
    value: 'linear-gradient(90deg, rgba(255,94,0,1) 0%, rgba(255,140,0,1) 33%, rgba(255,140,0,1) 69%, rgba(255,94,0,1) 100%)'
  }, {
    label: 'グリーンとライム',
    value: 'linear-gradient(90deg, rgba(34,177,76,1) 0%, rgba(102,255,0,1) 33%, rgba(102,255,0,1) 69%, rgba(34,177,76,1) 100%)'
  }, {
    label: 'ピンクとマゼンタ',
    value: 'linear-gradient(90deg, rgba(255,20,147,1) 0%, rgba(255,105,180,1) 33%, rgba(255,105,180,1) 69%, rgba(255,20,147,1) 100%)'
  }, {
    label: '黄色とオレンジ',
    value: 'linear-gradient(90deg, rgba(255,223,0,1) 0%, rgba(255,165,0,1) 33%, rgba(255,165,0,1) 69%, rgba(255,223,0,1) 100%)'
  }, {
    label: 'ネイビーと青',
    value: 'linear-gradient(90deg, rgba(0,0,128,1) 0%, rgba(0,0,255,1) 33%, rgba(0,0,255,1) 69%, rgba(0,0,128,1) 100%)'
  }, {
    label: 'ライムグリーンとエメラルド',
    value: 'linear-gradient(90deg, rgba(0,255,127,1) 0%, rgba(0,255,191,1) 33%, rgba(0,255,191,1) 69%, rgba(0,255,127,1) 100%)'
  }, {
    label: 'ターコイズとシアン',
    value: 'linear-gradient(90deg, rgba(64,224,208,1) 0%, rgba(72,209,204,1) 33%, rgba(72,209,204,1) 69%, rgba(64,224,208,1) 100%)'
  },
  //左右
  {
    label: '青と黄色（左右）',
    value: 'linear-gradient(90deg, #00C6FF, #F8FF00)'
  }, {
    label: '紫とピンク（左右）',
    value: 'linear-gradient(90deg, #7F00FF, #E100FF)'
  }, {
    label: '赤とオレンジ（左右）',
    value: 'linear-gradient(90deg, #FF512F, #DD2476)'
  }, {
    label: '青と水色（左右）',
    value: 'linear-gradient(90deg, #2193b0, #6dd5ed)'
  }, {
    label: '緑とライムグリーン（左右）',
    value: 'linear-gradient(90deg, #00b09b, #96c93d)'
  }, {
    label: 'ピンクと黄色（左右）',
    value: 'linear-gradient(90deg, #ff758c, #fdd365)'
  }, {
    label: 'ネオンブルーとパープル（左右）',
    value: 'linear-gradient(90deg, #00f260, #0575e6)'
  }, {
    label: 'オレンジとピンク（左右）',
    value: 'linear-gradient(90deg, #ff9966, #ff5e62)'
  }, {
    label: 'ゴールドとブラウン（左右）',
    value: 'linear-gradient(90deg, #f1c40f, #e67e22)'
  }, {
    label: 'イエローとグリーン（左右）',
    value: 'linear-gradient(90deg, #fdfc47, #24fe41)'
  },
  //浮き出し
  {
    label: 'エメラルドグリーン浮き出し',
    value: 'linear-gradient( to bottom, #00f0d0 0%, #00b894 50%, #006b52 100%)'
  }, {
    label: 'ピンク浮き出し',
    value: 'linear-gradient( to bottom, #ff758c 0%, #ff7eb3 50%, #ff4e50 100%)'
  }, {
    label: '紫浮き出し',
    value: 'linear-gradient( to bottom, #654ea3 0%, #8b6fa9 50%, #483D8B 100%)'
  }, {
    label: 'ライトブルー浮き出し',
    value: 'linear-gradient( to bottom, #89f7fe 0%, #66a6ff 50%, #0066ff 100%)'
  }, {
    label: 'グリーン浮き出し',
    value: 'linear-gradient( to bottom, #9be15d 0%, #00e3ae 50%, #006b3f 100%)'
  }, {
    label: 'オレンジ浮き出し',
    value: 'linear-gradient( to bottom, #fc4a1a 0%, #f7b733 50%, #d35400 100%)'
  }, {
    label: 'ネオンブルー浮き出し',
    value: 'linear-gradient( to bottom, #43e97b 0%, #38f9d7 50%, #2c82c9 100%)'
  }, {
    label: 'ゴールド浮き出し',
    value: 'linear-gradient( to bottom, #f1c40f 0%, #e67e22 50%, #d35400 100%)'
  }, {
    label: 'ライムグリーン浮き出し',
    value: 'linear-gradient( to bottom, #00f260 0%, #0575e6 50%, #004d40 100%)'
  }, {
    label: 'レッド浮き出し',
    value: 'linear-gradient( to bottom, #ff5858 0%, #f09819 50%, #d32f2f 100%)'
  }];
}

// SVG アイコンを変数に格納
var icon_chevron_right = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></svg>';
var icon_arrow_down = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/></svg>';
var icon_arrow_up = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2 160 448c0 17.7 14.3 32 32 32s32-14.3 32-32l0-306.7L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"/></svg>';
var icon_arrow_left = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>';
var icon_arrow_right = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/></svg>';
var icon_link = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z"/></svg>';
var icon_arrow_up_right = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"/></svg>';
var icon_circle_chevron_right_bg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM241 377c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l87-87-87-87c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L345 239c9.4 9.4 9.4 24.6 0 33.9L241 377z"/></svg>';
var icon_circle_check = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z"/></svg>';
var icon_circle_check_bg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>';
var icon_download = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 242.7-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7 288 32zM64 352c-35.3 0-64 28.7-64 64l0 32c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-32c0-35.3-28.7-64-64-64l-101.5 0-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352 64 352zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"/></svg>';
var icon_tel_1 = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg>';
var icon_tel_2 = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zm90.7 96.7c9.7-2.6 19.9 2.3 23.7 11.6l20 48c3.4 8.2 1 17.6-5.8 23.2L168 231.7c16.6 35.2 45.1 63.7 80.3 80.3l20.2-24.7c5.6-6.8 15-9.2 23.2-5.8l48 20c9.3 3.9 14.2 14 11.6 23.7l-12 44C336.9 378 329 384 320 384C196.3 384 96 283.7 96 160c0-9 6-16.9 14.7-19.3l44-12z"/></svg>';
var icon_tel_3 = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M16 64C16 28.7 44.7 0 80 0L304 0c35.3 0 64 28.7 64 64l0 384c0 35.3-28.7 64-64 64L80 512c-35.3 0-64-28.7-64-64L16 64zM144 448c0 8.8 7.2 16 16 16l64 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-64 0c-8.8 0-16 7.2-16 16zM304 64L80 64l0 320 224 0 0-320z"/></svg>';
var icon_tel_4 = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M256 48C141.1 48 48 141.1 48 256l0 40c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-40C0 114.6 114.6 0 256 0S512 114.6 512 256l0 144.1c0 48.6-39.4 88-88.1 88L313.6 488c-8.3 14.3-23.8 24-41.6 24l-32 0c-26.5 0-48-21.5-48-48s21.5-48 48-48l32 0c17.8 0 33.3 9.7 41.6 24l110.4 .1c22.1 0 40-17.9 40-40L464 256c0-114.9-93.1-208-208-208zM144 208l16 0c17.7 0 32 14.3 32 32l0 112c0 17.7-14.3 32-32 32l-16 0c-35.3 0-64-28.7-64-64l0-48c0-35.3 28.7-64 64-64zm224 0c35.3 0 64 28.7 64 64l0 48c0 35.3-28.7 64-64 64l-16 0c-17.7 0-32-14.3-32-32l0-112c0-17.7 14.3-32 32-32l16 0z"/></svg>';
var icon_tel_5 = '<svg xmlns="http://www.w3.org/2000/svg" width="35.933" height="35.931" viewBox="0 0 35.933 35.931"><g transform="translate(0.001 -0.012)"><path d="M22.191,146.619a1.163,1.163,0,0,0-1.551-.083L18.454,148.3a1.161,1.161,0,0,1-1.478-.016,30.492,30.492,0,0,1-7.224-7.224,1.161,1.161,0,0,1-.016-1.478L11.5,137.4a1.162,1.162,0,0,0-.083-1.551l-4.184-4.184a1.165,1.165,0,0,0-1.57-.068L.414,136a1.16,1.16,0,0,0-.276,1.439s.705,1.441,1.361,2.543a52.052,52.052,0,0,0,16.555,16.555c1.1.655,2.542,1.362,2.542,1.362a1.163,1.163,0,0,0,1.438-.278l4.409-5.248a1.164,1.164,0,0,0-.068-1.569Z" transform="translate(0 -122.094)"/><path d="M248.832,164.2l1.742-.276a9.24,9.24,0,0,0-7.66-7.66l-.277,1.741a7.478,7.478,0,0,1,6.195,6.195Z" transform="translate(-225.61 -145.289)"/><path d="M278.825,5.715a20.25,20.25,0,0,0-11.192-5.7l-.274,1.742a18.566,18.566,0,0,1,15.426,15.426l1.743-.275A20.255,20.255,0,0,0,278.825,5.715Z" transform="translate(-248.597)"/><path d="M255.285,78.054l-.274,1.744a12.995,12.995,0,0,1,10.813,10.813l1.743-.275a14.76,14.76,0,0,0-12.282-12.282Z" transform="translate(-237.115 -72.565)"/></g></svg>';
var icon_mail_1 = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M64 112c-8.8 0-16 7.2-16 16l0 22.1L220.5 291.7c20.7 17 50.4 17 71.1 0L464 150.1l0-22.1c0-8.8-7.2-16-16-16L64 112zM48 212.2L48 384c0 8.8 7.2 16 16 16l384 0c8.8 0 16-7.2 16-16l0-171.8L322 328.8c-38.4 31.5-93.7 31.5-132 0L48 212.2zM0 128C0 92.7 28.7 64 64 64l384 0c35.3 0 64 28.7 64 64l0 256c0 35.3-28.7 64-64 64L64 448c-35.3 0-64-28.7-64-64L0 128z"/></svg>';
var icon_mail_2 = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48L48 64zM0 176L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-208L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"/></svg>';
var icon_mail_3 = '<svg xmlns="http://www.w3.org/2000/svg" width="27.93" height="21" viewBox="0 0 27.93 21"><path  d="M449.525,176.452l-3.6-3.744,3.6-3.107Z" transform="translate(-421.595 -163.813)"/><path  d="M3.609,172.707,0,176.456V169.6Z" transform="translate(0 -163.813)"/><path  d="M27.93,260.483v3.448a1.511,1.511,0,0,1-1.51,1.51H1.51A1.51,1.51,0,0,1,0,263.93v-3.448l5.4-5.6,6.166,5.311a3.8,3.8,0,0,0,4.8,0l6.162-5.311Z" transform="translate(0 -244.44)"/><path  d="M27.93,65.025v1.51L14.759,77.881a1.285,1.285,0,0,1-1.588,0L0,66.535v-1.51a1.507,1.507,0,0,1,1.51-1.506H26.42A1.507,1.507,0,0,1,27.93,65.025Z" transform="translate(0 -63.519)"/></svg>';
var icon_pdf_1 = '<svg xmlns="http://www.w3.org/2000/svg" width="30.272" height="37.206" viewBox="0 0 30.272 37.206"><g  transform="translate(-47.706)"><path data-name="パス 17" d="M71.738,0H58.418l-.677.677-9.358,9.359-.677.677V30.964a6.249,6.249,0,0,0,6.242,6.242h17.79a6.249,6.249,0,0,0,6.241-6.242V6.242A6.248,6.248,0,0,0,71.738,0Zm3.93,30.964a3.93,3.93,0,0,1-3.93,3.931H53.948a3.93,3.93,0,0,1-3.931-3.931V11.67H56.1a3.276,3.276,0,0,0,3.276-3.275V2.311H71.738a3.93,3.93,0,0,1,3.93,3.931Z" /><path data-name="パス 18" d="M137.436,252.785h-2.073a.593.593,0,0,0-.631.641v5.36a.726.726,0,1,0,1.45,0v-1.628a.053.053,0,0,1,.06-.059h1.194a2.164,2.164,0,1,0,0-4.313Zm-.089,3.06h-1.105a.053.053,0,0,1-.06-.059V254.1a.053.053,0,0,1,.06-.059h1.105a.906.906,0,1,1,0,1.806Z" transform="translate(-80.702 -234.416)" /><path data-name="パス 19" d="M221.857,252.785h-1.589a.593.593,0,0,0-.631.641v5.439a.585.585,0,0,0,.631.632h1.589c1.431,0,2.32-.454,2.675-1.55a8.344,8.344,0,0,0,0-3.613C224.177,253.239,223.288,252.785,221.857,252.785Zm1.284,4.659c-.168.533-.651.76-1.323.76h-.671a.053.053,0,0,1-.06-.059v-4.007a.053.053,0,0,1,.06-.059h.671c.672,0,1.155.227,1.323.76a7.268,7.268,0,0,1,0,2.606Z" transform="translate(-159.438 -234.416)" /><path data-name="パス 20" d="M311.544,252.785h-3.256a.594.594,0,0,0-.632.641v5.36a.727.727,0,1,0,1.451,0v-1.915a.052.052,0,0,1,.059-.059h1.9a.624.624,0,1,0,0-1.244h-1.9a.052.052,0,0,1-.059-.059V254.1a.052.052,0,0,1,.059-.059h2.379a.628.628,0,1,0,0-1.253Z" transform="translate(-241.06 -234.416)" /></g></svg>';
var icon_home_1 = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 16.2c0 22.1-17.9 40-40 40l-16 0c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1L416 512l-24 0c-22.1 0-40-17.9-40-40l0-24 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"/></svg>';
var icon_calendar_1 = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M96 32l0 32L48 64C21.5 64 0 85.5 0 112l0 48 448 0 0-48c0-26.5-21.5-48-48-48l-48 0 0-32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 32L160 64l0-32c0-17.7-14.3-32-32-32S96 14.3 96 32zM448 192L0 192 0 464c0 26.5 21.5 48 48 48l352 0c26.5 0 48-21.5 48-48l0-272z"/></svg>';
var icon_book = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M96 0C43 0 0 43 0 96L0 416c0 53 43 96 96 96l288 0 32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l0-64c17.7 0 32-14.3 32-32l0-320c0-17.7-14.3-32-32-32L384 0 96 0zm0 384l256 0 0 64L96 448c-17.7 0-32-14.3-32-32s14.3-32 32-32zm32-240c0-8.8 7.2-16 16-16l192 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-192 0c-8.8 0-16-7.2-16-16zm16 48l192 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-192 0c-8.8 0-16-7.2-16-16s7.2-16 16-16z"/></svg>';
//sns アイコン
var icon_youtube = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z"/></svg>';
var icon_line_1 = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M311 196.8v81.3c0 2.1-1.6 3.7-3.7 3.7h-13c-1.3 0-2.4-.7-3-1.5l-37.3-50.3v48.2c0 2.1-1.6 3.7-3.7 3.7h-13c-2.1 0-3.7-1.6-3.7-3.7V196.9c0-2.1 1.6-3.7 3.7-3.7h12.9c1.1 0 2.4 .6 3 1.6l37.3 50.3V196.9c0-2.1 1.6-3.7 3.7-3.7h13c2.1-.1 3.8 1.6 3.8 3.5zm-93.7-3.7h-13c-2.1 0-3.7 1.6-3.7 3.7v81.3c0 2.1 1.6 3.7 3.7 3.7h13c2.1 0 3.7-1.6 3.7-3.7V196.8c0-1.9-1.6-3.7-3.7-3.7zm-31.4 68.1H150.3V196.8c0-2.1-1.6-3.7-3.7-3.7h-13c-2.1 0-3.7 1.6-3.7 3.7v81.3c0 1 .3 1.8 1 2.5c.7 .6 1.5 1 2.5 1h52.2c2.1 0 3.7-1.6 3.7-3.7v-13c0-1.9-1.6-3.7-3.5-3.7zm193.7-68.1H327.3c-1.9 0-3.7 1.6-3.7 3.7v81.3c0 1.9 1.6 3.7 3.7 3.7h52.2c2.1 0 3.7-1.6 3.7-3.7V265c0-2.1-1.6-3.7-3.7-3.7H344V247.7h35.5c2.1 0 3.7-1.6 3.7-3.7V230.9c0-2.1-1.6-3.7-3.7-3.7H344V213.5h35.5c2.1 0 3.7-1.6 3.7-3.7v-13c-.1-1.9-1.7-3.7-3.7-3.7zM512 93.4V419.4c-.1 51.2-42.1 92.7-93.4 92.6H92.6C41.4 511.9-.1 469.8 0 418.6V92.6C.1 41.4 42.2-.1 93.4 0H419.4c51.2 .1 92.7 42.1 92.6 93.4zM441.6 233.5c0-83.4-83.7-151.3-186.4-151.3s-186.4 67.9-186.4 151.3c0 74.7 66.3 137.4 155.9 149.3c21.8 4.7 19.3 12.7 14.4 42.1c-.8 4.7-3.8 18.4 16.1 10.1s107.3-63.2 146.5-108.2c27-29.7 39.9-59.8 39.9-93.1z"/></svg>';
var icon_instagram_1 = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg>';
var icon_x_1 = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/></svg>';
var icon_twitter_1 = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M459.4 151.7c.3 4.5 .3 9.1 .3 13.6 0 138.7-105.6 298.6-298.6 298.6-59.5 0-114.7-17.2-161.1-47.1 8.4 1 16.6 1.3 25.3 1.3 49.1 0 94.2-16.6 130.3-44.8-46.1-1-84.8-31.2-98.1-72.8 6.5 1 13 1.6 19.8 1.6 9.4 0 18.8-1.3 27.6-3.6-48.1-9.7-84.1-52-84.1-103v-1.3c14 7.8 30.2 12.7 47.4 13.3-28.3-18.8-46.8-51-46.8-87.4 0-19.5 5.2-37.4 14.3-53 51.7 63.7 129.3 105.3 216.4 109.8-1.6-7.8-2.6-15.9-2.6-24 0-57.8 46.8-104.9 104.9-104.9 30.2 0 57.5 12.7 76.7 33.1 23.7-4.5 46.5-13.3 66.6-25.3-7.8 24.4-24.4 44.8-46.1 57.8 21.1-2.3 41.6-8.1 60.4-16.2-14.3 20.8-32.2 39.3-52.6 54.3z"/></svg>';
var icon_twitter_2 = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM351.3 199.3v0c0 86.7-66 186.6-186.6 186.6c-37.2 0-71.7-10.8-100.7-29.4c5.3 .6 10.4 .8 15.8 .8c30.7 0 58.9-10.4 81.4-28c-28.8-.6-53-19.5-61.3-45.5c10.1 1.5 19.2 1.5 29.6-1.2c-30-6.1-52.5-32.5-52.5-64.4v-.8c8.7 4.9 18.9 7.9 29.6 8.3c-9-6-16.4-14.1-21.5-23.6s-7.8-20.2-7.7-31c0-12.2 3.2-23.4 8.9-33.1c32.3 39.8 80.8 65.8 135.2 68.6c-9.3-44.5 24-80.6 64-80.6c18.9 0 35.9 7.9 47.9 20.7c14.8-2.8 29-8.3 41.6-15.8c-4.9 15.2-15.2 28-28.8 36.1c13.2-1.4 26-5.1 37.8-10.2c-8.9 13.1-20.1 24.7-32.9 34c.2 2.8 .2 5.7 .2 8.5z"/></svg>';
var icon_threads_1 = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M331.5 235.7c2.2 .9 4.2 1.9 6.3 2.8c29.2 14.1 50.6 35.2 61.8 61.4c15.7 36.5 17.2 95.8-30.3 143.2c-36.2 36.2-80.3 52.5-142.6 53h-.3c-70.2-.5-124.1-24.1-160.4-70.2c-32.3-41-48.9-98.1-49.5-169.6V256v-.2C17 184.3 33.6 127.2 65.9 86.2C102.2 40.1 156.2 16.5 226.4 16h.3c70.3 .5 124.9 24 162.3 69.9c18.4 22.7 32 50 40.6 81.7l-40.4 10.8c-7.1-25.8-17.8-47.8-32.2-65.4c-29.2-35.8-73-54.2-130.5-54.6c-57 .5-100.1 18.8-128.2 54.4C72.1 146.1 58.5 194.3 58 256c.5 61.7 14.1 109.9 40.3 143.3c28 35.6 71.2 53.9 128.2 54.4c51.4-.4 85.4-12.6 113.7-40.9c32.3-32.2 31.7-71.8 21.4-95.9c-6.1-14.2-17.1-26-31.9-34.9c-3.7 26.9-11.8 48.3-24.7 64.8c-17.1 21.8-41.4 33.6-72.7 35.3c-23.6 1.3-46.3-4.4-63.9-16c-20.8-13.8-33-34.8-34.3-59.3c-2.5-48.3 35.7-83 95.2-86.4c21.1-1.2 40.9-.3 59.2 2.8c-2.4-14.8-7.3-26.6-14.6-35.2c-10-11.7-25.6-17.7-46.2-17.8H227c-16.6 0-39 4.6-53.3 26.3l-34.4-23.6c19.2-29.1 50.3-45.1 87.8-45.1h.8c62.6 .4 99.9 39.5 103.7 107.7l-.2 .2zm-156 68.8c1.3 25.1 28.4 36.8 54.6 35.3c25.6-1.4 54.6-11.4 59.5-73.2c-13.2-2.9-27.8-4.4-43.4-4.4c-4.8 0-9.6 .1-14.4 .4c-42.9 2.4-57.2 23.2-56.2 41.8l-.1 .1z"/></svg>';
var icon_threads_2 = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM294.2 244.3c19.5 9.3 33.7 23.5 41.2 40.9c10.4 24.3 11.4 63.9-20.2 95.4c-24.2 24.1-53.5 35-95.1 35.3h-.2c-46.8-.3-82.8-16.1-106.9-46.8C91.5 341.8 80.4 303.7 80 256v-.1-.1c.4-47.7 11.5-85.7 33-113.1c24.2-30.7 60.2-46.5 106.9-46.8h.2c46.9 .3 83.3 16 108.2 46.6c12.3 15.1 21.3 33.3 27 54.4l-26.9 7.2c-4.7-17.2-11.9-31.9-21.4-43.6c-19.4-23.9-48.7-36.1-87-36.4c-38 .3-66.8 12.5-85.5 36.2c-17.5 22.3-26.6 54.4-26.9 95.5c.3 41.1 9.4 73.3 26.9 95.5c18.7 23.8 47.4 36 85.5 36.2c34.3-.3 56.9-8.4 75.8-27.3c21.5-21.5 21.1-47.9 14.2-64c-4-9.4-11.4-17.3-21.3-23.3c-2.4 18-7.9 32.2-16.5 43.2c-11.4 14.5-27.7 22.4-48.4 23.5c-15.7 .9-30.8-2.9-42.6-10.7c-13.9-9.2-22-23.2-22.9-39.5c-1.7-32.2 23.8-55.3 63.5-57.6c14.1-.8 27.3-.2 39.5 1.9c-1.6-9.9-4.9-17.7-9.8-23.4c-6.7-7.8-17.1-11.8-30.8-11.9h-.4c-11 0-26 3.1-35.6 17.6l-23-15.8c12.8-19.4 33.6-30.1 58.5-30.1h.6c41.8 .3 66.6 26.3 69.1 71.8c1.4 .6 2.8 1.2 4.2 1.9l.1 .5zm-71.8 67.5c17-.9 36.4-7.6 39.7-48.8c-8.8-1.9-18.6-2.9-29-2.9c-3.2 0-6.4 .1-9.6 .3c-28.6 1.6-38.1 15.5-37.4 27.9c.9 16.7 19 24.5 36.4 23.6l-.1-.1z"/></svg>';
var icon_facebook_1 = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z"/></svg>';
var icon_facebook_2 = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5V334.2H141.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H287V510.1C413.8 494.8 512 386.9 512 256h0z"/></svg>';
var icon_tiktok_1 = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M448 209.9a210.1 210.1 0 0 1 -122.8-39.3V349.4A162.6 162.6 0 1 1 185 188.3V278.2a74.6 74.6 0 1 0 52.2 71.2V0l88 0a121.2 121.2 0 0 0 1.9 22.2h0A122.2 122.2 0 0 0 381 102.4a121.4 121.4 0 0 0 67 20.1z"/></svg>';
var icon_pinterest_1 = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M496 256c0 137-111 248-248 248-25.6 0-50.2-3.9-73.4-11.1 10.1-16.5 25.2-43.5 30.8-65 3-11.6 15.4-59 15.4-59 8.1 15.4 31.7 28.5 56.8 28.5 74.8 0 128.7-68.8 128.7-154.3 0-81.9-66.9-143.2-152.9-143.2-107 0-163.9 71.8-163.9 150.1 0 36.4 19.4 81.7 50.3 96.1 4.7 2.2 7.2 1.2 8.3-3.3 .8-3.4 5-20.3 6.9-28.1 .6-2.5 .3-4.7-1.7-7.1-10.1-12.5-18.3-35.3-18.3-56.6 0-54.7 41.4-107.6 112-107.6 60.9 0 103.6 41.5 103.6 100.9 0 67.1-33.9 113.6-78 113.6-24.3 0-42.6-20.1-36.7-44.8 7-29.5 20.5-61.3 20.5-82.6 0-19-10.2-34.9-31.4-34.9-24.9 0-44.9 25.7-44.9 60.2 0 22 7.4 36.8 7.4 36.8s-24.5 103.8-29 123.2c-5 21.4-3 51.6-.9 71.2C65.4 450.9 0 361.1 0 256 0 119 111 8 248 8s248 111 248 248z"/></svg>';
//その他（サービス用）
var icon_file_1 = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 288c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128z"/></svg>';
var icon_men = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"/></svg>';
var icon_truck_1 = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M48 0C21.5 0 0 21.5 0 48L0 368c0 26.5 21.5 48 48 48l16 0c0 53 43 96 96 96s96-43 96-96l128 0c0 53 43 96 96 96s96-43 96-96l32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l0-64 0-32 0-18.7c0-17-6.7-33.3-18.7-45.3L512 114.7c-12-12-28.3-18.7-45.3-18.7L416 96l0-48c0-26.5-21.5-48-48-48L48 0zM416 160l50.7 0L544 237.3l0 18.7-128 0 0-96zM112 416a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm368-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/></svg>';
var icon_photo_1 = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M149.1 64.8L138.7 96 64 96C28.7 96 0 124.7 0 160L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-256c0-35.3-28.7-64-64-64l-74.7 0L362.9 64.8C356.4 45.2 338.1 32 317.4 32L194.6 32c-20.7 0-39 13.2-45.5 32.8zM256 192a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"/></svg>';
var icon_crown_1 = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M372.2 52c0 20.9-12.4 39-30.2 47.2L448 192l104.4-20.9c-5.3-7.7-8.4-17.1-8.4-27.1c0-26.5 21.5-48 48-48s48 21.5 48 48c0 26-20.6 47.1-46.4 48L481 442.3c-10.3 23-33.2 37.7-58.4 37.7l-205.2 0c-25.2 0-48-14.8-58.4-37.7L46.4 192C20.6 191.1 0 170 0 144c0-26.5 21.5-48 48-48s48 21.5 48 48c0 10.1-3.1 19.4-8.4 27.1L192 192 298.1 99.1c-17.7-8.3-30-26.3-30-47.1c0-28.7 23.3-52 52-52s52 23.3 52 52z"/></svg>';
var icon_search_1 = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>';

// アイコンオプションを定義する関数
function rightButtonIconSvgArr() {
  return [{
    label: '未選択',
    value: ''
  }, {
    label: 'カレント（右）',
    value: icon_chevron_right
  },
  // { label: '矢印（下）', value: icon_arrow_down },
  // { label: '矢印（上）', value: icon_arrow_up },
  // { label: '矢印（左）', value: icon_arrow_left },
  {
    label: '矢印（右）',
    value: icon_arrow_right
  }, {
    label: 'リンク',
    value: icon_link
  }, {
    label: 'メール 1',
    value: icon_mail_1
  }, {
    label: 'メール 2',
    value: icon_mail_2
  }, {
    label: 'メール 3',
    value: icon_mail_3
  }, {
    label: '電話 1',
    value: icon_tel_1
  }, {
    label: '電話 2',
    value: icon_tel_2
  }, {
    label: '電話 3',
    value: icon_tel_5
  }, {
    label: '電話（スマホ）',
    value: icon_tel_3
  }, {
    label: '電話(オペレーター)',
    value: icon_tel_4
  }, {
    label: 'PDF 1',
    value: icon_pdf_1
  }, {
    label: 'LINE 1',
    value: icon_line_1
  }, {
    label: '四角矢印（右上）',
    value: icon_arrow_up_right
  }, {
    label: '丸矢印（右・塗潰し）',
    value: icon_circle_chevron_right_bg
  }, {
    label: '丸チェック',
    value: icon_circle_check
  }, {
    label: '丸チェック（塗潰し）',
    value: icon_circle_check_bg
  }, {
    label: 'ダウンロード',
    value: icon_download
  }];
}

// アイコンオプションを定義する関数
function leftButtonIconSvgArr() {
  return [{
    label: '未選択',
    value: ''
  },
  // { label: 'カレント（右）', value: icon_chevron_right },
  // { label: '矢印（下）', value: icon_arrow_down },
  // { label: '矢印（上）', value: icon_arrow_up },
  {
    label: '矢印（左）',
    value: icon_arrow_left
  }, {
    label: '矢印（右）',
    value: icon_arrow_right
  }, {
    label: '電話 1',
    value: icon_tel_1
  }, {
    label: '電話 2',
    value: icon_tel_2
  }, {
    label: '電話 3',
    value: icon_tel_5
  }, {
    label: '電話（スマホ）',
    value: icon_tel_3
  }, {
    label: '電話(オペレーター)',
    value: icon_tel_4
  }, {
    label: 'PDF 1',
    value: icon_pdf_1
  }, {
    label: 'リンク',
    value: icon_link
  }, {
    label: 'メール 1',
    value: icon_mail_1
  }, {
    label: 'メール 2',
    value: icon_mail_2
  }, {
    label: 'メール 3',
    value: icon_mail_3
  }, {
    label: 'LINE 1',
    value: icon_line_1
  }, {
    label: '四角矢印（右上）',
    value: icon_arrow_up_right
  }, {
    label: '丸矢印（右・塗潰し）',
    value: icon_circle_chevron_right_bg
  }, {
    label: '丸チェック',
    value: icon_circle_check
  }, {
    label: '丸チェック（塗潰し）',
    value: icon_circle_check_bg
  }, {
    label: 'ダウンロード',
    value: icon_download
  }, {
    label: 'カレンダー',
    value: icon_calendar_1
  }, {
    label: 'book',
    value: icon_book
  }, {
    label: 'Instagram 1',
    value: icon_instagram_1
  }, {
    label: 'ホームページ 1',
    value: icon_home_1
  }, {
    label: 'YouTube 1',
    value: icon_youtube
  }, {
    label: 'Threads 1',
    value: icon_threads_1
  }, {
    label: 'Threads 2',
    value: icon_threads_2
  }, {
    label: 'X 1',
    value: icon_x_1
  }, {
    label: 'Twitter 1',
    value: icon_twitter_1
  }, {
    label: 'Twitter 2',
    value: icon_twitter_2
  }, {
    label: 'Facebook 1',
    value: icon_facebook_1
  }, {
    label: 'Facebook 2',
    value: icon_facebook_2
  }, {
    label: 'TikTok 1',
    value: icon_tiktok_1
  }, {
    label: 'Pinterest 1',
    value: icon_pinterest_1
  }];
}

//サービス紹介やインフォメーション用
function serviceInfoIconSvgArr() {
  return [{
    label: 'アイコンの選択',
    value: ''
  }, {
    label: 'ホーム',
    value: icon_home_1
  }, {
    label: 'カレンダー',
    value: icon_calendar_1
  }, {
    label: 'book',
    value: icon_book
  }, {
    label: '人',
    value: icon_men
  }, {
    label: 'ファイル 1',
    value: icon_file_1
  }, {
    label: 'トラック 1',
    value: icon_truck_1
  }, {
    label: 'カメラ 1',
    value: icon_photo_1
  }, {
    label: '王冠 1',
    value: icon_crown_1
  }, {
    label: '虫眼鏡 1',
    value: icon_search_1
  }, {
    label: 'ダウンロード',
    value: icon_download
  }, {
    label: 'Instagram 1',
    value: icon_instagram_1
  }, {
    label: 'YouTube 1',
    value: icon_youtube
  }, {
    label: 'X 1',
    value: icon_x_1
  }, {
    label: 'Twitter 1',
    value: icon_twitter_1
  }, {
    label: 'Twitter 2',
    value: icon_twitter_2
  }, {
    label: 'Facebook 1',
    value: icon_facebook_1
  }, {
    label: 'Facebook 2',
    value: icon_facebook_2
  }, {
    label: 'TikTok 1',
    value: icon_tiktok_1
  }, {
    label: 'Pinterest 1',
    value: icon_pinterest_1
  }, {
    label: 'メール 1',
    value: icon_mail_1
  }, {
    label: 'メール 2',
    value: icon_mail_2
  }, {
    label: 'メール 3',
    value: icon_mail_3
  }, {
    label: '電話 1',
    value: icon_tel_1
  }, {
    label: '電話 2',
    value: icon_tel_2
  }, {
    label: '電話 3',
    value: icon_tel_5
  }, {
    label: '電話（スマホ）',
    value: icon_tel_3
  }, {
    label: '電話(オペレーター)',
    value: icon_tel_4
  }, {
    label: 'LINE 1',
    value: icon_line_1
  }];
}

/***/ }),

/***/ "./src/lw-pr-ranking-1/editor.scss":
/*!*****************************************!*\
  !*** ./src/lw-pr-ranking-1/editor.scss ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/lw-pr-ranking-1/style.scss":
/*!****************************************!*\
  !*** ./src/lw-pr-ranking-1/style.scss ***!
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

/***/ "./src/lw-pr-ranking-1/block.json":
/*!****************************************!*\
  !*** ./src/lw-pr-ranking-1/block.json ***!
  \****************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"wdl/lw-pr-ranking-1","version":"1.0.0","title":"ランキング 01","category":"lw-content","icon":"awards","description":"「おすすめ◯選」のように、商品やサービスを順位を付けて並べるブロックです。順位の札・評価・良い点／気になる点・お店のボタンが1件ぶんずつまとまっています。","aiHint":{"description":"ランキング。1位から順に、商品画像・商品名・評価・ひとこと・良い点・気になる点・複数店舗のボタンを縦に並べる。「おすすめ◯選」「人気ランキング」「比較して選ぶ」記事用。アフィリエイト（広告）リンクに対応","excludeFromAutoSelect":false,"contentAttributes":["items"],"imageAttributes":[],"notes":"✅ **1件＝`items` の1要素。** 並べた順がそのまま順位になる（1番目が1位）。件数は増減できる。✅ **URLが空のお店のボタンは出ない**ので、Amazonだけでもよい。✅ **画像が無い件は文字だけで詰めて出る**（写真の枠が空かない）。🚨 **`isAffiliate` の既定は true**（rel=\\"sponsored nofollow\\" と別タブ）。報酬の出ないリンクだけのときに false にする。🚨 **`showPr` の既定も true**（右上に「PR」の札）。ステマ規制（景品表示法）で要る表示なので、アフィリエイトなら消さない。🚨 **順位の根拠を本文に書くこと。** 何を・どのくらいの期間ためして決めた順位かが無いランキングは、読む人にも検索にも信用されない。🚨 **商品画像は自分で撮った写真か使用許諾のあるものだけ**（Amazon・楽天の商品画像の保存・転載は規約違反）。`items[].score` は「4.5」のような文字列で、0〜5として星の長さに使う。空なら星も数字も出ない。`items[].shops` は `[{label, url, bgColor, textColor}]`。効果を断定する言い方は薬機法で書けない（「治る」「消える」など）。","contentGuide":"1件ごとに name（商品名 10〜30文字）・comment（ひとこと 40〜90文字）・good（良い点 15〜40文字）・bad（気になる点 15〜40文字）。bad を空にしない方が読む人に信用される"},"supports":{"anchor":true,"className":true},"attributes":{"showPr":{"type":"boolean","default":true},"prText":{"type":"string","default":"PR"},"items":{"type":"array","default":[{"imageUrl":"","imageAlt":"","name":"1位の商品名を入れてください","comment":"選んだ理由をひとことで書きます。どんな人に向いているかを書くと選びやすくなります。","score":"4.8","good":"ここが良かった点を書きます","bad":"気になった点も正直に書きます","shops":[{"label":"Amazonで見る","url":"","bgColor":"#ff9900","textColor":"#ffffff"},{"label":"楽天市場で見る","url":"","bgColor":"#bf0000","textColor":"#ffffff"},{"label":"Yahoo!で見る","url":"","bgColor":"#ff0033","textColor":"#ffffff"}]},{"imageUrl":"","imageAlt":"","name":"2位の商品名を入れてください","comment":"選んだ理由をひとことで書きます。どんな人に向いているかを書くと選びやすくなります。","score":"4.4","good":"ここが良かった点を書きます","bad":"気になった点も正直に書きます","shops":[{"label":"Amazonで見る","url":"","bgColor":"#ff9900","textColor":"#ffffff"},{"label":"楽天市場で見る","url":"","bgColor":"#bf0000","textColor":"#ffffff"},{"label":"Yahoo!で見る","url":"","bgColor":"#ff0033","textColor":"#ffffff"}]},{"imageUrl":"","imageAlt":"","name":"3位の商品名を入れてください","comment":"選んだ理由をひとことで書きます。どんな人に向いているかを書くと選びやすくなります。","score":"4.1","good":"ここが良かった点を書きます","bad":"気になった点も正直に書きます","shops":[{"label":"Amazonで見る","url":"","bgColor":"#ff9900","textColor":"#ffffff"},{"label":"楽天市場で見る","url":"","bgColor":"#bf0000","textColor":"#ffffff"},{"label":"Yahoo!で見る","url":"","bgColor":"#ff0033","textColor":"#ffffff"}]}],"aiHint":{"role":"list","contentGuide":"ランキングの中身。並べた順が順位になる。各要素は name / comment / score / good / bad / imageUrl / shops"}},"rankStyle":{"type":"string","default":"number"},"rankUnit":{"type":"string","default":"位"},"showScore":{"type":"boolean","default":true},"goodLabel":{"type":"string","default":"ここが良い"},"badLabel":{"type":"string","default":"気になる点"},"isAffiliate":{"type":"boolean","default":true},"maxWidth":{"type":"number","default":720},"marginTop":{"type":"number","default":0},"marginBottom":{"type":"number","default":0},"itemGap":{"type":"number","default":24},"boxBgColor":{"type":"string","default":"#ffffff"},"boxBorderColor":{"type":"string","default":"#e5e5e5"},"boxBorderWidth":{"type":"number","default":1},"borderRadius":{"type":"number","default":10},"imageWidth":{"type":"number","default":180},"imageWidthSp":{"type":"number","default":110},"nameColor":{"type":"string","default":"#222222"},"nameFontSize":{"type":"number","default":19},"nameFontSizeSp":{"type":"number","default":17},"commentColor":{"type":"string","default":"#666666"},"scoreColor":{"type":"string","default":"#f0a020"},"goodColor":{"type":"string","default":"#1f7a4d"},"badColor":{"type":"string","default":"#9c5a5a"},"rank1Color":{"type":"string","default":"#c9a227"},"rank2Color":{"type":"string","default":"#98a2ad"},"rank3Color":{"type":"string","default":"#b0763c"},"rankOtherColor":{"type":"string","default":"#8a8a8a"},"rankTextColor":{"type":"string","default":"#ffffff"},"prBgColor":{"type":"string","default":"#f2f2f2"},"prTextColor":{"type":"string","default":"#8a8a8a"},"buttonColumnsPc":{"type":"number","default":3},"buttonColumnsSp":{"type":"number","default":1},"buttonRadius":{"type":"number","default":6},"buttonFontSize":{"type":"number","default":15},"FontSet":{"type":"string","default":""}},"editorScript":"file:./lw-pr-ranking-1.js"}');

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
/******/ 			"lw-pr-ranking-1": 0,
/******/ 			"./style-lw-pr-ranking-1": 0
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
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["./style-lw-pr-ranking-1"], () => (__webpack_require__("./src/lw-pr-ranking-1/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;