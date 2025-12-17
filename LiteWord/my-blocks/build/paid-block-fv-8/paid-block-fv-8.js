/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/paid-block-fv-8/index.js":
/*!**************************************!*\
  !*** ./src/paid-block-fv-8/index.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./style.scss */ "./src/paid-block-fv-8/style.scss");
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./editor.scss */ "./src/paid-block-fv-8/editor.scss");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./block.json */ "./src/paid-block-fv-8/block.json");
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
/* ----------------------------------------------------------
   LiteWord – FV 08 ブロック（wdl/paid-block-fv-8）
   2025-04-19 改訂: メインタイトル改行 ON/OFF 機能を追加
   2025-04-25 追記 : ポイント表示 ON/OFF 機能を追加（showPoint）
---------------------------------------------------------- */






(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_5__.name, {
  /* ====================================================== */
  edit: function edit(props) {
    var attributes = props.attributes,
      setAttributes = props.setAttributes;
    var backgroundImagePc = attributes.backgroundImagePc,
      backgroundImageSp = attributes.backgroundImageSp,
      mainTitle = attributes.mainTitle,
      subTitle = attributes.subTitle,
      leadText = attributes.leadText,
      listItem_1 = attributes.listItem_1,
      listItem_2 = attributes.listItem_2,
      listItem_3 = attributes.listItem_3,
      PointText_1 = attributes.PointText_1,
      PointText_2 = attributes.PointText_2,
      PointText_3 = attributes.PointText_3,
      bottomText = attributes.bottomText,
      noLineBreakMain = attributes.noLineBreakMain,
      showPoint = attributes.showPoint;
    var blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
      className: 'paid-block-fv-8'
    });

    /* ---------- ハンドラ ---------- */
    var onChangeBackgroundImagePc = function onChangeBackgroundImagePc(media) {
      return setAttributes({
        backgroundImagePc: media.url
      });
    };
    var onChangeBackgroundImageSp = function onChangeBackgroundImageSp(media) {
      return setAttributes({
        backgroundImageSp: media.url
      });
    };
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30DE\u30CB\u30E5\u30A2\u30EB"
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
      variant: "secondary",
      href: "https://youtu.be/vtKRJmt2y6E?si=3OGelL70znRo3_t_",
      target: "_blank"
    }, "\u3053\u306E\u30D6\u30ED\u30C3\u30AF\u306E\u4F7F\u3044\u65B9\u306F\u3053\u3061\u3089")), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u80CC\u666F\u753B\u50CF\u8A2D\u5B9A (PC)"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
      allowedTypes: ['image'],
      onSelect: onChangeBackgroundImagePc,
      value: backgroundImagePc,
      render: function render(_ref) {
        var open = _ref.open;
        return /*#__PURE__*/React.createElement(React.Fragment, null, backgroundImagePc && /*#__PURE__*/React.createElement("img", {
          src: backgroundImagePc,
          alt: "PC\u7528\u80CC\u666F\u753B\u50CF",
          style: {
            width: '100%'
          }
        }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          onClick: open,
          variant: "secondary"
        }, "PC\u7528\u753B\u50CF\u3092\u9078\u629E"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          onClick: function onClick() {
            return setAttributes({
              backgroundImagePc: ''
            });
          },
          variant: "secondary",
          style: {
            marginLeft: '10px'
          }
        }, "\u524A\u9664"));
      }
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u80CC\u666F\u753B\u50CF\u8A2D\u5B9A (\u30B9\u30DE\u30DB)"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
      allowedTypes: ['image'],
      onSelect: onChangeBackgroundImageSp,
      value: backgroundImageSp,
      render: function render(_ref2) {
        var open = _ref2.open;
        return /*#__PURE__*/React.createElement(React.Fragment, null, backgroundImageSp && /*#__PURE__*/React.createElement("img", {
          src: backgroundImageSp,
          alt: "\u30B9\u30DE\u30DB\u7528\u80CC\u666F\u753B\u50CF",
          style: {
            width: '100%'
          }
        }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          onClick: open,
          variant: "secondary"
        }, "\u30B9\u30DE\u30DB\u7528\u753B\u50CF\u3092\u9078\u629E"), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          onClick: function onClick() {
            return setAttributes({
              backgroundImageSp: ''
            });
          },
          variant: "secondary",
          style: {
            marginLeft: '10px'
          }
        }, "\u524A\u9664"));
      }
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u6587\u5B57\u8A2D\u5B9A"
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      label: "\u30E1\u30A4\u30F3\u30C6\u30AD\u30B9\u30C8\u3092\u6539\u884C\u3055\u305B\u306A\u3044",
      checked: noLineBreakMain,
      onChange: function onChange() {
        return setAttributes({
          noLineBreakMain: !noLineBreakMain
        });
      }
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30DD\u30A4\u30F3\u30C8\u8868\u793A"
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      label: "\u30DD\u30A4\u30F3\u30C8 (.point) \u3092\u8868\u793A\u3059\u308B",
      checked: showPoint,
      onChange: function onChange() {
        return setAttributes({
          showPoint: !showPoint
        });
      }
    }))), /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement("div", {
      className: "paid-block-fv-8_inner",
      "data-lw_font_set": "Noto Sans JP"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text_in"
    }, /*#__PURE__*/React.createElement("h2", {
      className: "ttl"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "span",
      className: "sub",
      value: subTitle,
      onChange: function onChange(v) {
        return setAttributes({
          subTitle: v
        });
      },
      placeholder: "\u30B5\u30D6\u30BF\u30A4\u30C8\u30EB"
    }), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "span",
      className: "main".concat(noLineBreakMain ? ' lw_in_text_split' : ''),
      value: mainTitle,
      onChange: function onChange(v) {
        return setAttributes({
          mainTitle: v
        });
      },
      placeholder: "\u30E1\u30A4\u30F3\u30BF\u30A4\u30C8\u30EB"
    })), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "p",
      className: "lead",
      value: leadText,
      onChange: function onChange(v) {
        return setAttributes({
          leadText: v
        });
      },
      placeholder: "\u30EA\u30FC\u30C9\u30C6\u30AD\u30B9\u30C8"
    }), /*#__PURE__*/React.createElement("div", {
      className: "btm_text pc"
    }, /*#__PURE__*/React.createElement("ul", {
      className: "list"
    }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "span",
      value: listItem_1.replace(/\n/g, '<br />'),
      onChange: function onChange(v) {
        return setAttributes({
          listItem_1: v.replace(/<br \/>/g, '\n')
        });
      }
    })), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "span",
      value: listItem_2.replace(/\n/g, '<br />'),
      onChange: function onChange(v) {
        return setAttributes({
          listItem_2: v.replace(/<br \/>/g, '\n')
        });
      }
    })), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "span",
      value: listItem_3.replace(/\n/g, '<br />'),
      onChange: function onChange(v) {
        return setAttributes({
          listItem_3: v.replace(/<br \/>/g, '\n')
        });
      }
    }))), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "p",
      value: bottomText,
      onChange: function onChange(v) {
        return setAttributes({
          bottomText: v
        });
      },
      placeholder: "\u30DC\u30C8\u30E0\u30C6\u30AD\u30B9\u30C8"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "image"
    }, /*#__PURE__*/React.createElement("picture", null, backgroundImageSp && /*#__PURE__*/React.createElement("source", {
      srcSet: backgroundImageSp,
      media: "(max-width: 768px)"
    }), backgroundImagePc && /*#__PURE__*/React.createElement("img", {
      src: backgroundImagePc,
      alt: "\u80CC\u666F\u753B\u50CF"
    })), showPoint && /*#__PURE__*/React.createElement("div", {
      className: "point"
    }, /*#__PURE__*/React.createElement("svg", {
      className: "star",
      xmlns: "http://www.w3.org/2000/svg",
      width: "30.468",
      height: "23.697",
      viewBox: "0 0 30.468 23.697"
    }, /*#__PURE__*/React.createElement("path", {
      id: "crown-solid",
      d: "M16.345,35.914a2.116,2.116,0,1,0-2.222,0l-3.031,6.062a1.694,1.694,0,0,1-2.571.566L3.808,38.771a2.116,2.116,0,1,0-1.693.846h.037l2.417,13.3A3.387,3.387,0,0,0,7.9,55.7H22.565A3.39,3.39,0,0,0,25.9,52.915l2.417-13.3h.037a2.116,2.116,0,1,0-1.693-.846l-4.713,3.771a1.694,1.694,0,0,1-2.571-.566Z",
      transform: "translate(0 -32)",
      fill: "#f39b1b"
    })), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "span",
      value: PointText_1,
      onChange: function onChange(v) {
        return setAttributes({
          PointText_1: v
        });
      },
      placeholder: "\u30C6\u30AD\u30B9\u30C8"
    }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "b",
      value: PointText_2,
      onChange: function onChange(v) {
        return setAttributes({
          PointText_2: v
        });
      },
      placeholder: "70"
    }), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "span",
      value: PointText_3,
      onChange: function onChange(v) {
        return setAttributes({
          PointText_3: v
        });
      },
      placeholder: "%"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "btm"
    }, _toConsumableArray(Array(3)).map(function (_, i) {
      return /*#__PURE__*/React.createElement("svg", {
        key: i,
        xmlns: "http://www.w3.org/2000/svg",
        width: "13.673",
        height: "13.259",
        viewBox: "0 0 13.673 13.259"
      }, /*#__PURE__*/React.createElement("path", {
        id: "star-solid",
        d: "M31.724.466a.83.83,0,0,0-1.491,0L28.568,3.892l-3.718.549a.829.829,0,0,0-.461,1.409l2.7,2.67-.637,3.773a.831.831,0,0,0,1.209.87l3.322-1.774L34.3,13.162a.831.831,0,0,0,1.209-.87l-.64-3.773,2.7-2.67a.829.829,0,0,0-.461-1.409l-3.721-.549Z",
        transform: "translate(-24.144)",
        fill: "#f39b1b"
      }));
    }))))), /*#__PURE__*/React.createElement("div", {
      className: "btm_text sp"
    }, /*#__PURE__*/React.createElement("ul", {
      className: "list"
    }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "span",
      value: listItem_1.replace(/\n/g, '<br />'),
      onChange: function onChange(v) {
        return setAttributes({
          listItem_1: v.replace(/<br \/>/g, '\n')
        });
      }
    })), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "span",
      value: listItem_2.replace(/\n/g, '<br />'),
      onChange: function onChange(v) {
        return setAttributes({
          listItem_2: v.replace(/<br \/>/g, '\n')
        });
      }
    })), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "span",
      value: listItem_3.replace(/\n/g, '<br />'),
      onChange: function onChange(v) {
        return setAttributes({
          listItem_3: v.replace(/<br \/>/g, '\n')
        });
      }
    }))), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "p",
      value: bottomText,
      onChange: function onChange(v) {
        return setAttributes({
          bottomText: v
        });
      },
      placeholder: "\u30DC\u30C8\u30E0\u30C6\u30AD\u30B9\u30C8"
    }))));
  },
  /* ====================================================== */
  save: function save(props) {
    var _props$attributes = props.attributes,
      backgroundImagePc = _props$attributes.backgroundImagePc,
      backgroundImageSp = _props$attributes.backgroundImageSp,
      mainTitle = _props$attributes.mainTitle,
      subTitle = _props$attributes.subTitle,
      leadText = _props$attributes.leadText,
      listItem_1 = _props$attributes.listItem_1,
      listItem_2 = _props$attributes.listItem_2,
      listItem_3 = _props$attributes.listItem_3,
      PointText_1 = _props$attributes.PointText_1,
      PointText_2 = _props$attributes.PointText_2,
      PointText_3 = _props$attributes.PointText_3,
      bottomText = _props$attributes.bottomText,
      noLineBreakMain = _props$attributes.noLineBreakMain,
      showPoint = _props$attributes.showPoint;
    var blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save({
      className: 'paid-block-fv-8'
    });
    return /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement("div", {
      className: "paid-block-fv-8_inner",
      "data-lw_font_set": "Noto Sans JP"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text_in"
    }, /*#__PURE__*/React.createElement("h2", {
      className: "ttl"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      tagName: "span",
      className: "sub",
      value: subTitle
    }), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      tagName: "span",
      className: "main".concat(noLineBreakMain ? ' lw_in_text_split' : ''),
      value: mainTitle
    })), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      tagName: "p",
      className: "lead",
      value: leadText
    }), /*#__PURE__*/React.createElement("div", {
      className: "btm_text pc"
    }, /*#__PURE__*/React.createElement("ul", {
      className: "list"
    }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      tagName: "span",
      value: listItem_1.replace(/\n/g, '<br />')
    })), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      tagName: "span",
      value: listItem_2.replace(/\n/g, '<br />')
    })), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      tagName: "span",
      value: listItem_3.replace(/\n/g, '<br />')
    }))), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      tagName: "p",
      value: bottomText
    }))), /*#__PURE__*/React.createElement("div", {
      className: "image"
    }, /*#__PURE__*/React.createElement("picture", null, backgroundImageSp && /*#__PURE__*/React.createElement("source", {
      srcSet: backgroundImageSp,
      media: "(max-width: 768px)"
    }), backgroundImagePc && /*#__PURE__*/React.createElement("img", {
      src: backgroundImagePc,
      alt: "\u80CC\u666F\u753B\u50CF",
      loading: "eager",
      fetchpriority: "high"
    })), showPoint && /*#__PURE__*/React.createElement("div", {
      className: "point"
    }, /*#__PURE__*/React.createElement("svg", {
      className: "star",
      xmlns: "http://www.w3.org/2000/svg",
      width: "30.468",
      height: "23.697",
      viewBox: "0 0 30.468 23.697"
    }, /*#__PURE__*/React.createElement("path", {
      id: "crown-solid",
      d: "M16.345,35.914a2.116,2.116,0,1,0-2.222,0l-3.031,6.062a1.694,1.694,0,0,1-2.571.566L3.808,38.771a2.116,2.116,0,1,0-1.693.846h.037l2.417,13.3A3.387,3.387,0,0,0,7.9,55.7H22.565A3.39,3.39,0,0,0,25.9,52.915l2.417-13.3h.037a2.116,2.116,0,1,0-1.693-.846l-4.713,3.771a1.694,1.694,0,0,1-2.571-.566Z",
      transform: "translate(0 -32)",
      fill: "#f39b1b"
    })), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      tagName: "span",
      value: PointText_1
    }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      tagName: "b",
      value: PointText_2
    }), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      tagName: "span",
      value: PointText_3
    }))), /*#__PURE__*/React.createElement("div", {
      className: "btm"
    }, _toConsumableArray(Array(3)).map(function (_, i) {
      return /*#__PURE__*/React.createElement("svg", {
        key: i,
        xmlns: "http://www.w3.org/2000/svg",
        width: "13.673",
        height: "13.259",
        viewBox: "0 0 13.673 13.259"
      }, /*#__PURE__*/React.createElement("path", {
        id: "star-solid",
        d: "M31.724.466a.83.83,0,0,0-1.491,0L28.568,3.892l-3.718.549a.829.829,0,0,0-.461,1.409l2.7,2.67-.637,3.773a.831.831,0,0,0,1.209.87l3.322-1.774L34.3,13.162a.831.831,0,0,0,1.209-.87l-.64-3.773,2.7-2.67a.829.829,0,0,0-.461-1.409l-3.721-.549Z",
        transform: "translate(-24.144)",
        fill: "#f39b1b"
      }));
    }))))), /*#__PURE__*/React.createElement("div", {
      className: "btm_text sp"
    }, /*#__PURE__*/React.createElement("ul", {
      className: "list"
    }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      tagName: "span",
      value: listItem_1.replace(/\n/g, '<br />')
    })), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      tagName: "span",
      value: listItem_2.replace(/\n/g, '<br />')
    })), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      tagName: "span",
      value: listItem_3.replace(/\n/g, '<br />')
    }))), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      tagName: "p",
      value: bottomText
    })));
  }
});

/***/ }),

/***/ "./src/paid-block-fv-8/editor.scss":
/*!*****************************************!*\
  !*** ./src/paid-block-fv-8/editor.scss ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/paid-block-fv-8/style.scss":
/*!****************************************!*\
  !*** ./src/paid-block-fv-8/style.scss ***!
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

/***/ "./src/paid-block-fv-8/block.json":
/*!****************************************!*\
  !*** ./src/paid-block-fv-8/block.json ***!
  \****************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"wdl/paid-block-fv-8","version":"1.0.0","title":"固定ページタイトル 08（トップ用）","category":"lw-firstview","icon":"cover-image","editorScript":"file:./paid-block-fv-8.js","editorStyle":["file:./editor.css","file:../../../assets/css/font_style.min.css","file:../../../assets/css/editor_block_side.min.css"],"style":"file:./style.css","supports":{"anchor":true},"attributes":{"backgroundImagePc":{"type":"string","default":"https://lite-word.com/sample_img/reception/man_1.webp"},"backgroundImageSp":{"type":"string","default":""},"mainTitle":{"type":"string","default":"水回りのトラブル\\n安心・即解決"},"subTitle":{"type":"string","default":"出張・持込み買取可能！"},"leadText":{"type":"string","default":"ただいま初回限定キャンペーン実施中！ \\n見積もり無料・年中無休で安心サポート！"},"listItem_1":{"type":"string","default":"最短\\n即日"},"listItem_2":{"type":"string","default":"年中\\n無休"},"listItem_3":{"type":"string","default":"実績\\n多数"},"PointText_1":{"type":"string","default":"お客様満足度"},"PointText_2":{"type":"string","default":"98"},"PointText_3":{"type":"string","default":"点"},"bottomText":{"type":"string","default":"水回りの小さなお悩みから大掛かりな修理まですべてお任せください！"},"noLineBreakMain":{"type":"boolean","default":false},"showPoint":{"type":"boolean","default":true}},"no":8}');

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
/******/ 			"paid-block-fv-8": 0,
/******/ 			"./style-paid-block-fv-8": 0
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
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["./style-paid-block-fv-8"], () => (__webpack_require__("./src/paid-block-fv-8/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;