/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/lw-pr-image-0/index.js":
/*!************************************!*\
  !*** ./src/lw-pr-image-0/index.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./style.scss */ "./src/lw-pr-image-0/style.scss");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./block.json */ "./src/lw-pr-image-0/block.json");
/* ----------------------------------------------------------
 * LiteWord – lw-pr-image-0
 * シンプルな画像ブロック
 * -------------------------------------------------------- */




/* エフェクトオプション */
var effectOptions = [{
  label: 'なし',
  value: 'none'
}, {
  label: 'グレースケール',
  value: 'grayscale'
}, {
  label: 'セピア',
  value: 'sepia'
}, {
  label: 'ぼかし',
  value: 'blur'
}, {
  label: '明るさ',
  value: 'brightness'
}, {
  label: 'コントラスト',
  value: 'contrast'
}, {
  label: '彩度',
  value: 'saturate'
}, {
  label: '色相回転',
  value: 'hue-rotate'
}, {
  label: '反転',
  value: 'invert'
}, {
  label: '透明度',
  value: 'opacity'
}];

/* 配置オプション */
var alignOptionsPc = [{
  label: '左寄せ',
  value: 'left'
}, {
  label: '中央',
  value: 'center'
}, {
  label: '右寄せ',
  value: 'right'
}];
var alignOptionsTbSp = [{
  label: '継承',
  value: 'inherit'
}, {
  label: '左寄せ',
  value: 'left'
}, {
  label: '中央',
  value: 'center'
}, {
  label: '右寄せ',
  value: 'right'
}];

/* 配置からmarginを取得 */
var getAlignMargins = function getAlignMargins(align) {
  switch (align) {
    case 'left':
      return {
        ml: '0',
        mr: 'auto'
      };
    case 'right':
      return {
        ml: 'auto',
        mr: '0'
      };
    case 'center':
    default:
      return {
        ml: 'auto',
        mr: 'auto'
      };
  }
};

/* object-fit オプション */
var objectFitOptionsPc = [{
  label: 'cover',
  value: 'cover'
}, {
  label: 'contain',
  value: 'contain'
}];
var objectFitOptionsTbSp = [{
  label: '継承',
  value: 'inherit'
}, {
  label: 'cover',
  value: 'cover'
}, {
  label: 'contain',
  value: 'contain'
}];



/* ============================================================== */
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_4__.name, {
  /* ============================ EDIT ============================ */edit: function edit(_ref) {
    var attributes = _ref.attributes,
      setAttributes = _ref.setAttributes;
    var _attributes$image = attributes.image,
      image = _attributes$image === void 0 ? '' : _attributes$image,
      _attributes$alt = attributes.alt,
      alt = _attributes$alt === void 0 ? '' : _attributes$alt,
      _attributes$maxWidthP = attributes.maxWidthPc,
      maxWidthPc = _attributes$maxWidthP === void 0 ? 0 : _attributes$maxWidthP,
      _attributes$maxWidthT = attributes.maxWidthTb,
      maxWidthTb = _attributes$maxWidthT === void 0 ? 0 : _attributes$maxWidthT,
      _attributes$maxWidthS = attributes.maxWidthSp,
      maxWidthSp = _attributes$maxWidthS === void 0 ? 0 : _attributes$maxWidthS,
      _attributes$aspectRat = attributes.aspectRatioW,
      aspectRatioW = _attributes$aspectRat === void 0 ? 600 : _attributes$aspectRat,
      _attributes$aspectRat2 = attributes.aspectRatioH,
      aspectRatioH = _attributes$aspectRat2 === void 0 ? 400 : _attributes$aspectRat2,
      _attributes$imgBorder = attributes.imgBorderRadiusPc,
      imgBorderRadiusPc = _attributes$imgBorder === void 0 ? 0 : _attributes$imgBorder,
      _attributes$imgBorder2 = attributes.imgBorderRadiusTb,
      imgBorderRadiusTb = _attributes$imgBorder2 === void 0 ? 0 : _attributes$imgBorder2,
      _attributes$imgBorder3 = attributes.imgBorderRadiusSp,
      imgBorderRadiusSp = _attributes$imgBorder3 === void 0 ? 0 : _attributes$imgBorder3,
      _attributes$rotatePc = attributes.rotatePc,
      rotatePc = _attributes$rotatePc === void 0 ? 0 : _attributes$rotatePc,
      _attributes$rotateTb = attributes.rotateTb,
      rotateTb = _attributes$rotateTb === void 0 ? 0 : _attributes$rotateTb,
      _attributes$rotateSp = attributes.rotateSp,
      rotateSp = _attributes$rotateSp === void 0 ? 0 : _attributes$rotateSp,
      _attributes$rotateInh = attributes.rotateInheritTb,
      rotateInheritTb = _attributes$rotateInh === void 0 ? true : _attributes$rotateInh,
      _attributes$rotateInh2 = attributes.rotateInheritSp,
      rotateInheritSp = _attributes$rotateInh2 === void 0 ? true : _attributes$rotateInh2,
      _attributes$imageEffe = attributes.imageEffect,
      imageEffect = _attributes$imageEffe === void 0 ? 'none' : _attributes$imageEffe,
      _attributes$effectGra = attributes.effectGrayscale,
      effectGrayscale = _attributes$effectGra === void 0 ? 100 : _attributes$effectGra,
      _attributes$effectSep = attributes.effectSepia,
      effectSepia = _attributes$effectSep === void 0 ? 100 : _attributes$effectSep,
      _attributes$effectBlu = attributes.effectBlur,
      effectBlur = _attributes$effectBlu === void 0 ? 3 : _attributes$effectBlu,
      _attributes$effectBri = attributes.effectBrightness,
      effectBrightness = _attributes$effectBri === void 0 ? 130 : _attributes$effectBri,
      _attributes$effectCon = attributes.effectContrast,
      effectContrast = _attributes$effectCon === void 0 ? 150 : _attributes$effectCon,
      _attributes$effectSat = attributes.effectSaturate,
      effectSaturate = _attributes$effectSat === void 0 ? 200 : _attributes$effectSat,
      _attributes$effectInv = attributes.effectInvert,
      effectInvert = _attributes$effectInv === void 0 ? 100 : _attributes$effectInv,
      _attributes$effectHue = attributes.effectHueRotate,
      effectHueRotate = _attributes$effectHue === void 0 ? 180 : _attributes$effectHue,
      _attributes$effectOpa = attributes.effectOpacity,
      effectOpacity = _attributes$effectOpa === void 0 ? 50 : _attributes$effectOpa,
      _attributes$linkUrl = attributes.linkUrl,
      linkUrl = _attributes$linkUrl === void 0 ? '' : _attributes$linkUrl,
      _attributes$linkOpenN = attributes.linkOpenNewTab,
      linkOpenNewTab = _attributes$linkOpenN === void 0 ? false : _attributes$linkOpenN,
      _attributes$alignPc = attributes.alignPc,
      alignPc = _attributes$alignPc === void 0 ? 'center' : _attributes$alignPc,
      _attributes$alignTb = attributes.alignTb,
      alignTb = _attributes$alignTb === void 0 ? 'inherit' : _attributes$alignTb,
      _attributes$alignSp = attributes.alignSp,
      alignSp = _attributes$alignSp === void 0 ? 'inherit' : _attributes$alignSp,
      _attributes$objectFit = attributes.objectFitPc,
      objectFitPc = _attributes$objectFit === void 0 ? 'cover' : _attributes$objectFit,
      _attributes$objectFit2 = attributes.objectFitTb,
      objectFitTb = _attributes$objectFit2 === void 0 ? 'inherit' : _attributes$objectFit2,
      _attributes$objectFit3 = attributes.objectFitSp,
      objectFitSp = _attributes$objectFit3 === void 0 ? 'inherit' : _attributes$objectFit3;

    /* エフェクトをCSSフィルターに変換 */
    var getFilterStyle = function getFilterStyle(effect) {
      switch (effect) {
        case 'grayscale':
          return "grayscale(".concat(effectGrayscale, "%)");
        case 'sepia':
          return "sepia(".concat(effectSepia, "%)");
        case 'blur':
          return "blur(".concat(effectBlur, "px)");
        case 'brightness':
          return "brightness(".concat(effectBrightness, "%)");
        case 'contrast':
          return "contrast(".concat(effectContrast, "%)");
        case 'saturate':
          return "saturate(".concat(effectSaturate, "%)");
        case 'hue-rotate':
          return "hue-rotate(".concat(effectHueRotate, "deg)");
        case 'invert':
          return "invert(".concat(effectInvert, "%)");
        case 'opacity':
          return "opacity(".concat(effectOpacity, "%)");
        default:
          return 'none';
      }
    };

    /* 数値を CSS 値に変換 (0 = 100%, それ以外 = px) */
    var toMaxWidthValue = function toMaxWidthValue(v) {
      return v === 0 ? '100%' : "".concat(v, "px");
    };

    /* 継承ロジック: PC → TB → SP (0は継承) */
    var effectiveMaxWidthTb = maxWidthTb === 0 ? maxWidthPc : maxWidthTb;
    var effectiveMaxWidthSp = maxWidthSp === 0 ? effectiveMaxWidthTb : maxWidthSp;

    /* 角丸の継承ロジック: PC → TB → SP (0は継承) */
    var effectiveRadiusTb = imgBorderRadiusTb === 0 ? imgBorderRadiusPc : imgBorderRadiusTb;
    var effectiveRadiusSp = imgBorderRadiusSp === 0 ? effectiveRadiusTb : imgBorderRadiusSp;

    /* 角度の継承ロジック: PC → TB → SP (トグルで継承) */
    var effectiveRotateTb = rotateInheritTb ? rotatePc : rotateTb;
    var effectiveRotateSp = rotateInheritSp ? effectiveRotateTb : rotateSp;

    /* 配置の継承ロジック: PC → TB → SP */
    var effectiveAlignTb = alignTb === 'inherit' ? alignPc : alignTb;
    var effectiveAlignSp = alignSp === 'inherit' ? effectiveAlignTb : alignSp;
    var marginsPc = getAlignMargins(alignPc);
    var marginsTb = getAlignMargins(effectiveAlignTb);
    var marginsSp = getAlignMargins(effectiveAlignSp);

    /* object-fit の継承ロジック: PC → TB → SP */
    var effectiveObjFitTb = objectFitTb === 'inherit' ? objectFitPc : objectFitTb;
    var effectiveObjFitSp = objectFitSp === 'inherit' ? effectiveObjFitTb : objectFitSp;
    var blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
      className: 'lw-pr-image-0',
      style: {
        '--image-0-max-w-pc': toMaxWidthValue(maxWidthPc),
        '--image-0-max-w-tb': toMaxWidthValue(effectiveMaxWidthTb),
        '--image-0-max-w-sp': toMaxWidthValue(effectiveMaxWidthSp),
        '--image-0-radius-pc': "".concat(imgBorderRadiusPc, "px"),
        '--image-0-radius-tb': "".concat(effectiveRadiusTb, "px"),
        '--image-0-radius-sp': "".concat(effectiveRadiusSp, "px"),
        '--image-0-rotate-pc': "".concat(rotatePc, "deg"),
        '--image-0-rotate-tb': "".concat(effectiveRotateTb, "deg"),
        '--image-0-rotate-sp': "".concat(effectiveRotateSp, "deg"),
        '--image-0-filter': getFilterStyle(imageEffect),
        '--image-0-ml-pc': marginsPc.ml,
        '--image-0-mr-pc': marginsPc.mr,
        '--image-0-ml-tb': marginsTb.ml,
        '--image-0-mr-tb': marginsTb.mr,
        '--image-0-ml-sp': marginsSp.ml,
        '--image-0-mr-sp': marginsSp.mr,
        '--image-0-fit-pc': objectFitPc,
        '--image-0-fit-tb': effectiveObjFitTb,
        '--image-0-fit-sp': effectiveObjFitSp
      }
    });
    var wrapStyle = {
      aspectRatio: "".concat(aspectRatioW, " / ").concat(aspectRatioH)
    };
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
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
      label: "\u6700\u5927\u5E45 - PC : ".concat(maxWidthPc === 0 ? '100%' : maxWidthPc + 'px'),
      value: maxWidthPc,
      onChange: function onChange(v) {
        return setAttributes({
          maxWidthPc: v
        });
      },
      min: 0,
      max: 1200,
      step: 10,
      help: "0 = 100%"
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u6700\u5927\u5E45 - \u30BF\u30D6\u30EC\u30C3\u30C8 : ".concat(maxWidthTb === 0 ? '継承(' + toMaxWidthValue(maxWidthPc) + ')' : maxWidthTb + 'px'),
      value: maxWidthTb,
      onChange: function onChange(v) {
        return setAttributes({
          maxWidthTb: v
        });
      },
      min: 0,
      max: 1200,
      step: 10,
      help: "0 = PC\u306E\u5024\u3092\u7D99\u627F"
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u6700\u5927\u5E45 - \u30B9\u30DE\u30DB : ".concat(maxWidthSp === 0 ? '継承(' + toMaxWidthValue(effectiveMaxWidthTb) + ')' : maxWidthSp + 'px'),
      value: maxWidthSp,
      onChange: function onChange(v) {
        return setAttributes({
          maxWidthSp: v
        });
      },
      min: 0,
      max: 1200,
      step: 10,
      help: "0 = \u30BF\u30D6\u30EC\u30C3\u30C8\u306E\u5024\u3092\u7D99\u627F"
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: "\u914D\u7F6E - PC",
      value: alignPc,
      options: alignOptionsPc,
      onChange: function onChange(v) {
        return setAttributes({
          alignPc: v
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: "\u914D\u7F6E - \u30BF\u30D6\u30EC\u30C3\u30C8".concat(alignTb === 'inherit' ? ' (継承)' : ''),
      value: alignTb,
      options: alignOptionsTbSp,
      onChange: function onChange(v) {
        return setAttributes({
          alignTb: v
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: "\u914D\u7F6E - \u30B9\u30DE\u30DB".concat(alignSp === 'inherit' ? ' (継承)' : ''),
      value: alignSp,
      options: alignOptionsTbSp,
      onChange: function onChange(v) {
        return setAttributes({
          alignSp: v
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: "\u30D5\u30A3\u30C3\u30C8 - PC",
      value: objectFitPc,
      options: objectFitOptionsPc,
      onChange: function onChange(v) {
        return setAttributes({
          objectFitPc: v
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: "\u30D5\u30A3\u30C3\u30C8 - \u30BF\u30D6\u30EC\u30C3\u30C8".concat(objectFitTb === 'inherit' ? ' (継承)' : ''),
      value: objectFitTb,
      options: objectFitOptionsTbSp,
      onChange: function onChange(v) {
        return setAttributes({
          objectFitTb: v
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: "\u30D5\u30A3\u30C3\u30C8 - \u30B9\u30DE\u30DB".concat(objectFitSp === 'inherit' ? ' (継承)' : ''),
      value: objectFitSp,
      options: objectFitOptionsTbSp,
      onChange: function onChange(v) {
        return setAttributes({
          objectFitSp: v
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u6BD4\u7387 - \u6A2A : ".concat(aspectRatioW),
      value: aspectRatioW,
      onChange: function onChange(v) {
        return setAttributes({
          aspectRatioW: v
        });
      },
      min: 100,
      max: 1200,
      step: 10,
      help: "aspect-ratio: ".concat(aspectRatioW, " / ").concat(aspectRatioH)
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u6BD4\u7387 - \u7E26 : ".concat(aspectRatioH),
      value: aspectRatioH,
      onChange: function onChange(v) {
        return setAttributes({
          aspectRatioH: v
        });
      },
      min: 100,
      max: 1200,
      step: 10,
      help: "aspect-ratio: ".concat(aspectRatioW, " / ").concat(aspectRatioH)
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u89D2\u4E38 - PC : ".concat(imgBorderRadiusPc, "px"),
      value: imgBorderRadiusPc,
      onChange: function onChange(v) {
        return setAttributes({
          imgBorderRadiusPc: v
        });
      },
      min: 0,
      max: 100,
      step: 1
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u89D2\u4E38 - \u30BF\u30D6\u30EC\u30C3\u30C8 : ".concat(imgBorderRadiusTb === 0 ? '継承(' + imgBorderRadiusPc + 'px)' : imgBorderRadiusTb + 'px'),
      value: imgBorderRadiusTb,
      onChange: function onChange(v) {
        return setAttributes({
          imgBorderRadiusTb: v
        });
      },
      min: 0,
      max: 100,
      step: 1,
      help: "0 = PC\u306E\u5024\u3092\u7D99\u627F"
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u89D2\u4E38 - \u30B9\u30DE\u30DB : ".concat(imgBorderRadiusSp === 0 ? '継承(' + effectiveRadiusTb + 'px)' : imgBorderRadiusSp + 'px'),
      value: imgBorderRadiusSp,
      onChange: function onChange(v) {
        return setAttributes({
          imgBorderRadiusSp: v
        });
      },
      min: 0,
      max: 100,
      step: 1,
      help: "0 = \u30BF\u30D6\u30EC\u30C3\u30C8\u306E\u5024\u3092\u7D99\u627F"
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u89D2\u5EA6 - PC : ".concat(rotatePc, "deg"),
      value: rotatePc,
      onChange: function onChange(v) {
        return setAttributes({
          rotatePc: v
        });
      },
      min: -180,
      max: 180,
      step: 1
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      label: "\u30BF\u30D6\u30EC\u30C3\u30C8\u3067PC\u306E\u89D2\u5EA6\u3092\u7D99\u627F",
      checked: rotateInheritTb,
      onChange: function onChange(v) {
        return setAttributes({
          rotateInheritTb: v
        });
      }
    }), !rotateInheritTb && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u89D2\u5EA6 - \u30BF\u30D6\u30EC\u30C3\u30C8 : ".concat(rotateTb, "deg"),
      value: rotateTb,
      onChange: function onChange(v) {
        return setAttributes({
          rotateTb: v
        });
      },
      min: -180,
      max: 180,
      step: 1
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      label: "\u30B9\u30DE\u30DB\u3067\u30BF\u30D6\u30EC\u30C3\u30C8\u306E\u89D2\u5EA6\u3092\u7D99\u627F",
      checked: rotateInheritSp,
      onChange: function onChange(v) {
        return setAttributes({
          rotateInheritSp: v
        });
      }
    }), !rotateInheritSp && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u89D2\u5EA6 - \u30B9\u30DE\u30DB : ".concat(rotateSp, "deg"),
      value: rotateSp,
      onChange: function onChange(v) {
        return setAttributes({
          rotateSp: v
        });
      },
      min: -180,
      max: 180,
      step: 1
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u30A8\u30D5\u30A7\u30AF\u30C8",
      initialOpen: false
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: "\u753B\u50CF\u30A8\u30D5\u30A7\u30AF\u30C8",
      value: imageEffect,
      options: effectOptions,
      onChange: function onChange(v) {
        return setAttributes({
          imageEffect: v
        });
      }
    }), imageEffect === 'grayscale' && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u30B0\u30EC\u30FC\u30B9\u30B1\u30FC\u30EB : ".concat(effectGrayscale, "%"),
      value: effectGrayscale,
      onChange: function onChange(v) {
        return setAttributes({
          effectGrayscale: v
        });
      },
      min: 0,
      max: 100,
      step: 1
    }), imageEffect === 'sepia' && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u30BB\u30D4\u30A2 : ".concat(effectSepia, "%"),
      value: effectSepia,
      onChange: function onChange(v) {
        return setAttributes({
          effectSepia: v
        });
      },
      min: 0,
      max: 100,
      step: 1
    }), imageEffect === 'blur' && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u307C\u304B\u3057 : ".concat(effectBlur, "px"),
      value: effectBlur,
      onChange: function onChange(v) {
        return setAttributes({
          effectBlur: v
        });
      },
      min: 0,
      max: 20,
      step: 0.5
    }), imageEffect === 'brightness' && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u660E\u308B\u3055 : ".concat(effectBrightness, "%"),
      value: effectBrightness,
      onChange: function onChange(v) {
        return setAttributes({
          effectBrightness: v
        });
      },
      min: 0,
      max: 300,
      step: 5,
      help: "100% = \u901A\u5E38\u3001100%\u672A\u6E80 = \u6697\u304F\u3001100%\u8D85 = \u660E\u308B\u304F"
    }), imageEffect === 'contrast' && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u30B3\u30F3\u30C8\u30E9\u30B9\u30C8 : ".concat(effectContrast, "%"),
      value: effectContrast,
      onChange: function onChange(v) {
        return setAttributes({
          effectContrast: v
        });
      },
      min: 0,
      max: 300,
      step: 5,
      help: "100% = \u901A\u5E38"
    }), imageEffect === 'saturate' && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u5F69\u5EA6 : ".concat(effectSaturate, "%"),
      value: effectSaturate,
      onChange: function onChange(v) {
        return setAttributes({
          effectSaturate: v
        });
      },
      min: 0,
      max: 300,
      step: 5,
      help: "100% = \u901A\u5E38\u30010% = \u30B0\u30EC\u30FC\u30B9\u30B1\u30FC\u30EB"
    }), imageEffect === 'hue-rotate' && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u8272\u76F8\u56DE\u8EE2 : ".concat(effectHueRotate, "deg"),
      value: effectHueRotate,
      onChange: function onChange(v) {
        return setAttributes({
          effectHueRotate: v
        });
      },
      min: 0,
      max: 360,
      step: 5
    }), imageEffect === 'invert' && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u53CD\u8EE2 : ".concat(effectInvert, "%"),
      value: effectInvert,
      onChange: function onChange(v) {
        return setAttributes({
          effectInvert: v
        });
      },
      min: 0,
      max: 100,
      step: 1
    }), imageEffect === 'opacity' && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
      label: "\u900F\u660E\u5EA6 : ".concat(effectOpacity, "%"),
      value: effectOpacity,
      onChange: function onChange(v) {
        return setAttributes({
          effectOpacity: v
        });
      },
      min: 0,
      max: 100,
      step: 1,
      help: "100% = \u4E0D\u900F\u660E\u30010% = \u5B8C\u5168\u306B\u900F\u660E"
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
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
    }), !linkUrl && /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: '12px',
        opacity: .7
      }
    }, "\u203BURL\u3092\u5165\u529B\u3059\u308B\u3068\u8A2D\u5B9A\u3067\u304D\u307E\u3059"))), /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement("div", {
      className: "custom_wrap",
      style: wrapStyle
    }, image && /*#__PURE__*/React.createElement("img", {
      src: image,
      alt: alt
    }))));
  },
  /* ============================ SAVE ============================ */save: function save(_ref3) {
    var attributes = _ref3.attributes;
    var _attributes$image2 = attributes.image,
      image = _attributes$image2 === void 0 ? '' : _attributes$image2,
      _attributes$alt2 = attributes.alt,
      alt = _attributes$alt2 === void 0 ? '' : _attributes$alt2,
      _attributes$maxWidthP2 = attributes.maxWidthPc,
      maxWidthPc = _attributes$maxWidthP2 === void 0 ? 0 : _attributes$maxWidthP2,
      _attributes$maxWidthT2 = attributes.maxWidthTb,
      maxWidthTb = _attributes$maxWidthT2 === void 0 ? 0 : _attributes$maxWidthT2,
      _attributes$maxWidthS2 = attributes.maxWidthSp,
      maxWidthSp = _attributes$maxWidthS2 === void 0 ? 0 : _attributes$maxWidthS2,
      _attributes$aspectRat3 = attributes.aspectRatioW,
      aspectRatioW = _attributes$aspectRat3 === void 0 ? 600 : _attributes$aspectRat3,
      _attributes$aspectRat4 = attributes.aspectRatioH,
      aspectRatioH = _attributes$aspectRat4 === void 0 ? 400 : _attributes$aspectRat4,
      _attributes$imgBorder4 = attributes.imgBorderRadiusPc,
      imgBorderRadiusPc = _attributes$imgBorder4 === void 0 ? 0 : _attributes$imgBorder4,
      _attributes$imgBorder5 = attributes.imgBorderRadiusTb,
      imgBorderRadiusTb = _attributes$imgBorder5 === void 0 ? 0 : _attributes$imgBorder5,
      _attributes$imgBorder6 = attributes.imgBorderRadiusSp,
      imgBorderRadiusSp = _attributes$imgBorder6 === void 0 ? 0 : _attributes$imgBorder6,
      _attributes$rotatePc2 = attributes.rotatePc,
      rotatePc = _attributes$rotatePc2 === void 0 ? 0 : _attributes$rotatePc2,
      _attributes$rotateTb2 = attributes.rotateTb,
      rotateTb = _attributes$rotateTb2 === void 0 ? 0 : _attributes$rotateTb2,
      _attributes$rotateSp2 = attributes.rotateSp,
      rotateSp = _attributes$rotateSp2 === void 0 ? 0 : _attributes$rotateSp2,
      _attributes$rotateInh3 = attributes.rotateInheritTb,
      rotateInheritTb = _attributes$rotateInh3 === void 0 ? true : _attributes$rotateInh3,
      _attributes$rotateInh4 = attributes.rotateInheritSp,
      rotateInheritSp = _attributes$rotateInh4 === void 0 ? true : _attributes$rotateInh4,
      _attributes$imageEffe2 = attributes.imageEffect,
      imageEffect = _attributes$imageEffe2 === void 0 ? 'none' : _attributes$imageEffe2,
      _attributes$effectGra2 = attributes.effectGrayscale,
      effectGrayscale = _attributes$effectGra2 === void 0 ? 100 : _attributes$effectGra2,
      _attributes$effectSep2 = attributes.effectSepia,
      effectSepia = _attributes$effectSep2 === void 0 ? 100 : _attributes$effectSep2,
      _attributes$effectBlu2 = attributes.effectBlur,
      effectBlur = _attributes$effectBlu2 === void 0 ? 3 : _attributes$effectBlu2,
      _attributes$effectBri2 = attributes.effectBrightness,
      effectBrightness = _attributes$effectBri2 === void 0 ? 130 : _attributes$effectBri2,
      _attributes$effectCon2 = attributes.effectContrast,
      effectContrast = _attributes$effectCon2 === void 0 ? 150 : _attributes$effectCon2,
      _attributes$effectSat2 = attributes.effectSaturate,
      effectSaturate = _attributes$effectSat2 === void 0 ? 200 : _attributes$effectSat2,
      _attributes$effectInv2 = attributes.effectInvert,
      effectInvert = _attributes$effectInv2 === void 0 ? 100 : _attributes$effectInv2,
      _attributes$effectHue2 = attributes.effectHueRotate,
      effectHueRotate = _attributes$effectHue2 === void 0 ? 180 : _attributes$effectHue2,
      _attributes$effectOpa2 = attributes.effectOpacity,
      effectOpacity = _attributes$effectOpa2 === void 0 ? 50 : _attributes$effectOpa2,
      _attributes$linkUrl2 = attributes.linkUrl,
      linkUrl = _attributes$linkUrl2 === void 0 ? '' : _attributes$linkUrl2,
      _attributes$linkOpenN2 = attributes.linkOpenNewTab,
      linkOpenNewTab = _attributes$linkOpenN2 === void 0 ? false : _attributes$linkOpenN2,
      _attributes$alignPc2 = attributes.alignPc,
      alignPc = _attributes$alignPc2 === void 0 ? 'center' : _attributes$alignPc2,
      _attributes$alignTb2 = attributes.alignTb,
      alignTb = _attributes$alignTb2 === void 0 ? 'inherit' : _attributes$alignTb2,
      _attributes$alignSp2 = attributes.alignSp,
      alignSp = _attributes$alignSp2 === void 0 ? 'inherit' : _attributes$alignSp2,
      _attributes$objectFit4 = attributes.objectFitPc,
      objectFitPc = _attributes$objectFit4 === void 0 ? 'cover' : _attributes$objectFit4,
      _attributes$objectFit5 = attributes.objectFitTb,
      objectFitTb = _attributes$objectFit5 === void 0 ? 'inherit' : _attributes$objectFit5,
      _attributes$objectFit6 = attributes.objectFitSp,
      objectFitSp = _attributes$objectFit6 === void 0 ? 'inherit' : _attributes$objectFit6;

    /* エフェクトをCSSフィルターに変換 */
    var getFilterStyle = function getFilterStyle(effect) {
      switch (effect) {
        case 'grayscale':
          return "grayscale(".concat(effectGrayscale, "%)");
        case 'sepia':
          return "sepia(".concat(effectSepia, "%)");
        case 'blur':
          return "blur(".concat(effectBlur, "px)");
        case 'brightness':
          return "brightness(".concat(effectBrightness, "%)");
        case 'contrast':
          return "contrast(".concat(effectContrast, "%)");
        case 'saturate':
          return "saturate(".concat(effectSaturate, "%)");
        case 'hue-rotate':
          return "hue-rotate(".concat(effectHueRotate, "deg)");
        case 'invert':
          return "invert(".concat(effectInvert, "%)");
        case 'opacity':
          return "opacity(".concat(effectOpacity, "%)");
        default:
          return 'none';
      }
    };

    /* 数値を CSS 値に変換 (0 = 100%, それ以外 = px) */
    var toMaxWidthValue = function toMaxWidthValue(v) {
      return v === 0 ? '100%' : "".concat(v, "px");
    };

    /* 継承ロジック: PC → TB → SP (0は継承) */
    var effectiveMaxWidthTb = maxWidthTb === 0 ? maxWidthPc : maxWidthTb;
    var effectiveMaxWidthSp = maxWidthSp === 0 ? effectiveMaxWidthTb : maxWidthSp;

    /* 角丸の継承ロジック: PC → TB → SP (0は継承) */
    var effectiveRadiusTb = imgBorderRadiusTb === 0 ? imgBorderRadiusPc : imgBorderRadiusTb;
    var effectiveRadiusSp = imgBorderRadiusSp === 0 ? effectiveRadiusTb : imgBorderRadiusSp;

    /* 角度の継承ロジック: PC → TB → SP (トグルで継承) */
    var effectiveRotateTb = rotateInheritTb ? rotatePc : rotateTb;
    var effectiveRotateSp = rotateInheritSp ? effectiveRotateTb : rotateSp;

    /* 配置の継承ロジック: PC → TB → SP */
    var effectiveAlignTb = alignTb === 'inherit' ? alignPc : alignTb;
    var effectiveAlignSp = alignSp === 'inherit' ? effectiveAlignTb : alignSp;
    var marginsPc = getAlignMargins(alignPc);
    var marginsTb = getAlignMargins(effectiveAlignTb);
    var marginsSp = getAlignMargins(effectiveAlignSp);

    /* object-fit の継承ロジック: PC → TB → SP */
    var effectiveObjFitTb = objectFitTb === 'inherit' ? objectFitPc : objectFitTb;
    var effectiveObjFitSp = objectFitSp === 'inherit' ? effectiveObjFitTb : objectFitSp;
    var blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save({
      className: 'lw-pr-image-0',
      style: {
        '--image-0-max-w-pc': toMaxWidthValue(maxWidthPc),
        '--image-0-max-w-tb': toMaxWidthValue(effectiveMaxWidthTb),
        '--image-0-max-w-sp': toMaxWidthValue(effectiveMaxWidthSp),
        '--image-0-radius-pc': "".concat(imgBorderRadiusPc, "px"),
        '--image-0-radius-tb': "".concat(effectiveRadiusTb, "px"),
        '--image-0-radius-sp': "".concat(effectiveRadiusSp, "px"),
        '--image-0-rotate-pc': "".concat(rotatePc, "deg"),
        '--image-0-rotate-tb': "".concat(effectiveRotateTb, "deg"),
        '--image-0-rotate-sp': "".concat(effectiveRotateSp, "deg"),
        '--image-0-filter': getFilterStyle(imageEffect),
        '--image-0-ml-pc': marginsPc.ml,
        '--image-0-mr-pc': marginsPc.mr,
        '--image-0-ml-tb': marginsTb.ml,
        '--image-0-mr-tb': marginsTb.mr,
        '--image-0-ml-sp': marginsSp.ml,
        '--image-0-mr-sp': marginsSp.mr,
        '--image-0-fit-pc': objectFitPc,
        '--image-0-fit-tb': effectiveObjFitTb,
        '--image-0-fit-sp': effectiveObjFitSp
      }
    });
    var wrapStyle = {
      aspectRatio: "".concat(aspectRatioW, " / ").concat(aspectRatioH)
    };
    var imgElement = image ? /*#__PURE__*/React.createElement("img", {
      src: image,
      alt: alt
    }) : null;
    return /*#__PURE__*/React.createElement("div", blockProps, linkUrl ? /*#__PURE__*/React.createElement("a", {
      href: linkUrl,
      className: "custom_wrap",
      style: wrapStyle,
      target: linkOpenNewTab ? '_blank' : undefined,
      rel: linkOpenNewTab ? 'noopener noreferrer' : undefined
    }, imgElement) : /*#__PURE__*/React.createElement("div", {
      className: "custom_wrap",
      style: wrapStyle
    }, imgElement));
  }
});

/***/ }),

/***/ "./src/lw-pr-image-0/style.scss":
/*!**************************************!*\
  !*** ./src/lw-pr-image-0/style.scss ***!
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

/***/ "./src/lw-pr-image-0/block.json":
/*!**************************************!*\
  !*** ./src/lw-pr-image-0/block.json ***!
  \**************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"wdl/lw-pr-image-0","version":"1.0.0","title":"画像 00","category":"lw-media","icon":"format-image","description":"シンプルな画像ブロック","aiHint":{"description":"単一画像ブロック。画像1枚をカスタマイズ表示","excludeFromAutoSelect":false,"contentAttributes":[],"imageAttributes":["image"]},"supports":{"anchor":true},"editorScript":"file:./lw-pr-image-0.js","attributes":{"image":{"type":"string","default":"https://placehold.jp/600x400.png"},"alt":{"type":"string","default":""},"maxWidthPc":{"type":"number","default":0},"maxWidthTb":{"type":"number","default":0},"maxWidthSp":{"type":"number","default":0},"aspectRatioW":{"type":"number","default":600},"aspectRatioH":{"type":"number","default":400},"imgBorderRadiusPc":{"type":"number","default":0},"imgBorderRadiusTb":{"type":"number","default":0},"imgBorderRadiusSp":{"type":"number","default":0},"rotatePc":{"type":"number","default":0},"rotateTb":{"type":"number","default":0},"rotateSp":{"type":"number","default":0},"rotateInheritTb":{"type":"boolean","default":true},"rotateInheritSp":{"type":"boolean","default":true},"imageEffect":{"type":"string","default":"none"},"effectGrayscale":{"type":"number","default":100},"effectSepia":{"type":"number","default":100},"effectBlur":{"type":"number","default":3},"effectBrightness":{"type":"number","default":130},"effectContrast":{"type":"number","default":150},"effectSaturate":{"type":"number","default":200},"effectInvert":{"type":"number","default":100},"effectHueRotate":{"type":"number","default":180},"effectOpacity":{"type":"number","default":50},"linkUrl":{"type":"string","default":""},"linkOpenNewTab":{"type":"boolean","default":false},"alignPc":{"type":"string","default":"center"},"alignTb":{"type":"string","default":"inherit"},"alignSp":{"type":"string","default":"inherit"},"objectFitPc":{"type":"string","default":"cover"},"objectFitTb":{"type":"string","default":"inherit"},"objectFitSp":{"type":"string","default":"inherit"}}}');

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
/******/ 			"lw-pr-image-0": 0,
/******/ 			"./style-lw-pr-image-0": 0
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
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["./style-lw-pr-image-0"], () => (__webpack_require__("./src/lw-pr-image-0/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;