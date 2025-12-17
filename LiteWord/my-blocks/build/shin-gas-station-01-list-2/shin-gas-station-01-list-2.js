/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/shin-gas-station-01-list-2/index.js":
/*!*************************************************!*\
  !*** ./src/shin-gas-station-01-list-2/index.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./editor.scss */ "./src/shin-gas-station-01-list-2/editor.scss");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./block.json */ "./src/shin-gas-station-01-list-2/block.json");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./style.scss */ "./src/shin-gas-station-01-list-2/style.scss");
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }






(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_4__.name, {
  edit: function edit(props) {
    var attributes = props.attributes,
      setAttributes = props.setAttributes;
    var blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
      className: 'shin-gas-station-01-list-2'
    });
    var bgImage = attributes.bgImage,
      filterColor = attributes.filterColor,
      topTitleSub = attributes.topTitleSub,
      topTitleMain = attributes.topTitleMain,
      items = attributes.items;

    // items の追加（番号は自動計算）
    var addItem = function addItem() {
      var newIndex = items.length + 1;
      var newItem = {
        itemImage: '',
        no: String(newIndex).padStart(2, '0'),
        sub: 'Greeting',
        main: '代表あいさつ',
        description: '私たちは地域に根ざしたサービスを提供し、お客様の暮らしをより豊かにすることを目指してまいりました。\n地域社会や環境への配慮を欠かさず、持続可能な未来の実現に向けた取り組みにも積極的に取り組んでおります。',
        btnLabel: '代表あいさつ',
        url: ''
      };
      setAttributes({
        items: [].concat(_toConsumableArray(items), [newItem])
      });
    };
    var onChangeFilterColor = function onChangeFilterColor(color) {
      return setAttributes({
        filterColor: "rgba(".concat(color.rgb.r, ", ").concat(color.rgb.g, ", ").concat(color.rgb.b, ", ").concat(color.rgb.a, ")")
      });
    };
    // items の削除
    var removeItem = function removeItem(index) {
      var newItems = _toConsumableArray(items);
      newItems.splice(index, 1);
      setAttributes({
        items: newItems
      });
    };

    // 各項目の値更新（番号は自動計算のため対象外）
    var updateItem = function updateItem(index, key, value) {
      var newItems = _toConsumableArray(items);
      newItems[index][key] = value;
      setAttributes({
        items: newItems
      });
    };
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u80CC\u666F\u753B\u50CF\u306E\u8A2D\u5B9A",
      initialOpen: true
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
      onSelect: function onSelect(media) {
        return setAttributes({
          bgImage: media.url
        });
      },
      allowedTypes: ['image'],
      render: function render(_ref) {
        var open = _ref.open;
        return /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          onClick: open,
          isSecondary: true
        }, bgImage ? '背景画像を変更' : '背景画像を選択');
      }
    }), bgImage && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
      onClick: function onClick() {
        return setAttributes({
          bgImage: ''
        });
      },
      isDestructive: true,
      style: {
        marginTop: '8px'
      }
    }, "\u80CC\u666F\u753B\u50CF\u3092\u524A\u9664"), /*#__PURE__*/React.createElement("img", {
      src: bgImage,
      alt: "\u80CC\u666F\u30B5\u30E0\u30CD\u30A4\u30EB",
      style: {
        width: '100%',
        marginTop: '8px'
      }
    }))), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: "\u753B\u50CF\u306E\u4E0A\u306E\u30D5\u30A3\u30EB\u30BF\u30FC\u8272"
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorPicker, {
      color: filterColor,
      onChangeComplete: onChangeFilterColor,
      label: "\u30D5\u30A3\u30EB\u30BF\u30FC\u306E\u8272"
    }))), /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement("div", {
      className: "bg_image"
    }, bgImage && /*#__PURE__*/React.createElement("img", {
      src: bgImage,
      alt: ""
    }), /*#__PURE__*/React.createElement("div", {
      className: "filter",
      style: {
        background: filterColor
      }
    })), /*#__PURE__*/React.createElement("h2", {
      className: "ttl"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "span",
      className: "sub",
      value: topTitleSub,
      onChange: function onChange(val) {
        return setAttributes({
          topTitleSub: val
        });
      },
      placeholder: "\u30B5\u30D6\u30BF\u30A4\u30C8\u30EB\u3092\u5165\u529B"
    }), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
      tagName: "span",
      className: "main",
      "data-lw_font_set": "Montserrat",
      value: topTitleMain,
      onChange: function onChange(val) {
        return setAttributes({
          topTitleMain: val
        });
      },
      placeholder: "\u30E1\u30A4\u30F3\u30BF\u30A4\u30C8\u30EB\u3092\u5165\u529B"
    })), /*#__PURE__*/React.createElement("ul", {
      className: "list"
    }, items.map(function (item, index) {
      return /*#__PURE__*/React.createElement("li", {
        className: "item",
        key: index
      }, /*#__PURE__*/React.createElement("div", {
        className: "image"
      }, item.itemImage && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("img", {
        src: item.itemImage,
        alt: ""
      })), /*#__PURE__*/React.createElement("div", {
        className: "image_upload"
      }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
        onSelect: function onSelect(media) {
          return updateItem(index, 'itemImage', media.url);
        },
        allowedTypes: ['image'],
        render: function render(_ref2) {
          var open = _ref2.open;
          return /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
            onClick: open,
            isSecondary: true
          }, item.itemImage ? '画像を変更' : '画像を選択');
        }
      }), item.itemImage && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
        onClick: function onClick() {
          return updateItem(index, 'itemImage', '');
        },
        isDestructive: true,
        style: {
          marginTop: '8px'
        }
      }, "\u753B\u50CF\u3092\u524A\u9664")))), /*#__PURE__*/React.createElement("div", {
        className: "text_in"
      }, /*#__PURE__*/React.createElement("h3", {
        className: "ttl"
      }, /*#__PURE__*/React.createElement("span", {
        className: "sub"
      }, /*#__PURE__*/React.createElement("span", {
        className: "no"
      }, String(index + 1).padStart(2, '0')), /*#__PURE__*/React.createElement("span", {
        className: "sub-text"
      }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
        tagName: "span",
        "data-lw_font_set": "Montserrat",
        value: item.sub,
        onChange: function onChange(val) {
          return updateItem(index, 'sub', val);
        },
        placeholder: "\u30B5\u30D6\u30BF\u30A4\u30C8\u30EB"
      }))), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
        tagName: "span",
        className: "main",
        value: item.main,
        onChange: function onChange(val) {
          return updateItem(index, 'main', val);
        },
        placeholder: "\u30E1\u30A4\u30F3\u30BF\u30A4\u30C8\u30EB"
      })), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
        tagName: "p",
        value: item.description,
        onChange: function onChange(val) {
          return updateItem(index, 'description', val);
        },
        placeholder: "\u8AAC\u660E\u6587"
      }), /*#__PURE__*/React.createElement("a", {
        className: "btn",
        href: item.url
      }, /*#__PURE__*/React.createElement("span", {
        className: "btn-label"
      }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
        tagName: "span",
        value: item.btnLabel,
        onChange: function onChange(val) {
          return updateItem(index, 'btnLabel', val);
        },
        placeholder: "\u30DC\u30BF\u30F3\u30C6\u30AD\u30B9\u30C8"
      })), /*#__PURE__*/React.createElement("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: "39.5",
        height: "4.197",
        viewBox: "0 0 39.5 4.197"
      }, /*#__PURE__*/React.createElement("g", {
        transform: "translate(-179.5 -2154.803)",
        fill: "#059d47"
      }, /*#__PURE__*/React.createElement("path", {
        d: "M0,0,8,4.2H0Z",
        transform: "translate(211 2154.803)"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M32,.5H0v-1H32Z",
        transform: "translate(179.5 2158.5)"
      })))), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
        label: "\u30EA\u30F3\u30AF URL",
        value: item.url,
        onChange: function onChange(val) {
          return updateItem(index, 'url', val);
        },
        placeholder: "\u30EA\u30F3\u30AF URL \u3092\u5165\u529B",
        style: {
          marginTop: '8px'
        }
      })), /*#__PURE__*/React.createElement("div", {
        className: "delete_item_btn"
      }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
        isDestructive: true,
        onClick: function onClick() {
          return removeItem(index);
        },
        style: {
          marginTop: '10px'
        }
      }, "\u3053\u306E\u9805\u76EE\u3092\u524A\u9664")));
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
      isPrimary: true,
      onClick: addItem,
      style: {
        marginTop: '16px'
      }
    }, "\u9805\u76EE\u3092\u8FFD\u52A0")));
  },
  save: function save(props) {
    var attributes = props.attributes;
    var blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save({
      className: 'shin-gas-station-01-list-2'
    });
    var bgImage = attributes.bgImage,
      filterColor = attributes.filterColor,
      topTitleSub = attributes.topTitleSub,
      topTitleMain = attributes.topTitleMain,
      items = attributes.items;
    return /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement("div", {
      className: "bg_image"
    }, bgImage && /*#__PURE__*/React.createElement("img", {
      src: bgImage,
      alt: ""
    }), /*#__PURE__*/React.createElement("div", {
      className: "filter",
      style: {
        background: filterColor
      }
    })), /*#__PURE__*/React.createElement("h2", {
      className: "ttl"
    }, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      tagName: "span",
      className: "sub",
      value: topTitleSub
    }), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      tagName: "span",
      className: "main",
      "data-lw_font_set": "Montserrat",
      value: topTitleMain
    })), /*#__PURE__*/React.createElement("ul", {
      className: "list"
    }, items.map(function (item, index) {
      return /*#__PURE__*/React.createElement("li", {
        className: "item",
        key: index
      }, /*#__PURE__*/React.createElement("div", {
        className: "image"
      }, item.itemImage && /*#__PURE__*/React.createElement("img", {
        src: item.itemImage,
        alt: ""
      })), /*#__PURE__*/React.createElement("div", {
        className: "text_in"
      }, /*#__PURE__*/React.createElement("h3", {
        className: "ttl"
      }, /*#__PURE__*/React.createElement("span", {
        className: "sub"
      }, /*#__PURE__*/React.createElement("span", {
        className: "no",
        "data-lw_font_set": "Montserrat"
      }, String(index + 1).padStart(2, '0')), /*#__PURE__*/React.createElement("span", {
        className: "sub-text",
        "data-lw_font_set": "Montserrat"
      }, item.sub)), /*#__PURE__*/React.createElement("span", {
        className: "main"
      }, item.main)), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
        tagName: "p",
        value: item.description
      }), item.url && item.url !== '' && /*#__PURE__*/React.createElement("a", {
        className: "btn",
        href: item.url
      }, /*#__PURE__*/React.createElement("span", {
        className: "btn-label"
      }, item.btnLabel), /*#__PURE__*/React.createElement("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: "39.5",
        height: "4.197",
        viewBox: "0 0 39.5 4.197"
      }, /*#__PURE__*/React.createElement("g", {
        transform: "translate(-179.5 -2154.803)",
        fill: "var(--color-main)"
      }, /*#__PURE__*/React.createElement("path", {
        d: "M0,0,8,4.2H0Z",
        transform: "translate(211 2154.803)"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M32,.5H0v-1H32Z",
        transform: "translate(179.5 2158.5)"
      }))))));
    })));
  }
});

/***/ }),

/***/ "./src/shin-gas-station-01-list-2/editor.scss":
/*!****************************************************!*\
  !*** ./src/shin-gas-station-01-list-2/editor.scss ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/shin-gas-station-01-list-2/style.scss":
/*!***************************************************!*\
  !*** ./src/shin-gas-station-01-list-2/style.scss ***!
  \***************************************************/
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

/***/ "./src/shin-gas-station-01-list-2/block.json":
/*!***************************************************!*\
  !*** ./src/shin-gas-station-01-list-2/block.json ***!
  \***************************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"wdl/shin-gas-station-01-list-2","version":"1.0.0","title":"インフォリスト 2 shin shop pattern 01","category":"lw-list","icon":"images-alt2","supports":{"anchor":true},"attributes":{"bgImage":{"type":"string","source":"attribute","selector":".bg_image img","attribute":"src","default":"https://picsum.photos/1000/1000?random=4"},"filterColor":{"type":"string","default":"rgba(0, 0, 0, 0.5)"},"topTitleSub":{"type":"string","source":"html","selector":".ttl .sub","default":"私たちの会社について"},"topTitleMain":{"type":"string","source":"html","selector":".ttl .main","default":"Company"},"items":{"type":"array","source":"query","selector":"li.item","default":[{"itemImage":"https://picsum.photos/1000/1000?random=1","no":"01","sub":"Greeting","main":"代表あいさつ","description":"私たちは地域に根ざしたサービスを提供し、お客様の暮らしをより豊かにすることを目指してまいりました。\\n地域社会や環境への配慮を欠かさず、持続可能な未来の実現に向けた取り組みにも積極的に取り組んでおります。","btnLabel":"代表あいさつ","url":""},{"itemImage":"https://picsum.photos/1000/1000?random=2","no":"02","sub":"Overview & History","main":"会社概要・沿革","description":"DriveEaseは、小さなスタートから社会を支える企業へと進化し、移動の快適さと安心を提供しています。我々は地域社会と共に成長し、未来のカーライフを支える存在を目指します。","btnLabel":"会社概要・沿革","url":""},{"itemImage":"https://picsum.photos/1000/1000?random=3","no":"03","sub":"Office Infomation","main":"事業所案内","description":"東北地方を中心に皆さまのカーライフをより快適にお届けいただけるよう、各地域での店舗展開を行っております。\\n是非、お近くの店舗へお立ち寄りください。","btnLabel":"事業所案内","url":""}],"query":{"itemImage":{"type":"string","source":"attribute","selector":".image img","attribute":"src"},"no":{"type":"string","source":"text","selector":".sub .no"},"sub":{"type":"string","source":"html","selector":".sub .sub-text","default":"Greeting"},"main":{"type":"string","source":"html","selector":".ttl .main","default":"代表あいさつ"},"description":{"type":"string","source":"html","selector":".text_in p","default":"私たちは地域に根ざしたサービスを提供し、お客様の暮らしをより豊かにすることを目指してまいりました。\\n地域社会や環境への配慮を欠かさず、持続可能な未来の実現に向けた取り組みにも積極的に取り組んでおります。"},"btnLabel":{"type":"string","source":"html","selector":".btn .btn-label","default":"代表あいさつ"},"url":{"type":"string","source":"attribute","selector":".btn","attribute":"href","default":""}}}},"editorScript":"file:./shin-gas-station-01-list-2.js","editorStyle":["file:./editor.css","file:../../../assets/css/font_style.min.css","file:../../../assets/css/editor_block_side.min.css"],"style":"file:./style.css","no":15}');

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
/******/ 			"shin-gas-station-01-list-2": 0,
/******/ 			"./style-shin-gas-station-01-list-2": 0
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
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["./style-shin-gas-station-01-list-2"], () => (__webpack_require__("./src/shin-gas-station-01-list-2/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;