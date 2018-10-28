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



window.onload = function () {
  init();
};

function init() {
  vue_dist_vue_esm_js__WEBPACK_IMPORTED_MODULE_1__["default"].component('muffin-search-component', {
    data: function data() {
      return {
        inputValue: '',
        resultList: []
      };
    },
    template: "\n\t\t\t<div>\n\t\t\t\t<input @keyup=\"search\" v-model=\"inputValue\" type=\"text\">\n\t\t\t\t<div>\n\t\t\t\t\t{{ inputValue }}\n\t\t\t\t</div>\n\t\t\t\t<ul>\n\t\t\t\t\t<li v-for=\"item in resultList\">\n\t\t\t\t\t\t<a v-bind:href=\"item.url\" target=\"_blank\">{{ item.title }}</a>\n\t\t\t\t\t\t<span>{{ item.url }}</span>\n\t\t\t\t\t</li>\n\t\t\t\t</ul>\n\t\t\t</div>\n\t\t",
    methods: {
      search: function search() {
        console.log(this.inputValue);
        var result = muff__WEBPACK_IMPORTED_MODULE_0__["muff"].search(this.inputValue);
        console.log(result);
        this.resultList = result.list;
      }
    }
  });
  new vue_dist_vue_esm_js__WEBPACK_IMPORTED_MODULE_1__["default"]({
    el: '#muffin'
  });
  var query = {
    text: '',
    maxResults: 1000
  };
  var historyList = [];
  chrome.history.search(query, function (results) {
    // resultsは配列なので、forEach()関数を実行することが出来る
    results.forEach(function (result) {
      // resultひとつひとつがHistoryItem形式
      console.log(result.url);
      console.log(result.title);
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

/***/ })

}]);
//# sourceMappingURL=0.bundle.js.map