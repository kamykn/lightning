(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[0],{

/***/ "./assets/js/index.js":
/*!****************************!*\
  !*** ./assets/js/index.js ***!
  \****************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var muff__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! muff */ "./node_modules/muff/index.js");
/* harmony import */ var vue_dist_vue_esm_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue/dist/vue.esm.js */ "./node_modules/vue/dist/vue.esm.js");
/* harmony import */ var vue_rx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vue-rx */ "./node_modules/vue-rx/dist/vue-rx.esm.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _scss_style_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../scss/style.scss */ "./assets/scss/style.scss");
/* harmony import */ var _scss_style_scss__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_scss_style_scss__WEBPACK_IMPORTED_MODULE_5__);






vue_dist_vue_esm_js__WEBPACK_IMPORTED_MODULE_1__["default"].use(vue_rx__WEBPACK_IMPORTED_MODULE_2__["default"]);

window.onload = function () {
  init();
};

var vm = null;

function init() {
  vm = new vue_dist_vue_esm_js__WEBPACK_IMPORTED_MODULE_1__["default"]({
    el: '#muffin',
    data: {
      inputValue: ''
    },
    methods: {
      search: function search(inputValue) {
        return new Promise(function (resolve) {
          var results = muff__WEBPACK_IMPORTED_MODULE_0__["muff"].search(inputValue);
          resolve(results);
        });
      },
      setData: function setData(results) {
        return results.list;
      }
    },
    subscriptions: function subscriptions() {
      return {
        results: this.$watchAsObservable('inputValue').pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["pluck"])('newValue'), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["debounceTime"])(100), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["switchMap"])(this.search), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(this.setData))
      };
    }
  });
  var startTime = new Date().getTime() - 1000 * 60 * 60 * 24 * 265;
  var query = {
    text: '',
    startTime: startTime,
    maxResults: 1000000
  };
  var historyList = [];
  chrome.history.search(query, function (results) {
    // resultsは配列なので、forEach()関数を実行することが出来る
    results.forEach(function (result) {
      // resultひとつひとつがHistoryItem形式
      historyList.push({
        url: result.url,
        title: result.title
      });
    });
    console.log(historyList);
    console.log(results.length);
    muff__WEBPACK_IMPORTED_MODULE_0__["muff"].setSearchWordList(historyList);
  });
  muff__WEBPACK_IMPORTED_MODULE_0__["muff"].setReturnListLength(20);
}

/***/ }),

/***/ "./assets/scss/style.scss":
/*!********************************!*\
  !*** ./assets/scss/style.scss ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ })

}]);
//# sourceMappingURL=0.bundle.js.map