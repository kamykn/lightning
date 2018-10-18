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


console.log(1);

window.onload = function () {
  console.log(2);
  init();
};

function init() {
  console.log(3);
  vue_dist_vue_esm_js__WEBPACK_IMPORTED_MODULE_1__["default"].component('muffin-search-component', {
    data: function data() {
      return {
        inputValue: ''
      };
    },
    template: "\n\t\t\t<div>\n\t\t\t\t<input v-on:change=\"search\" v-model=\"inputValue\" type=\"text\">\n\t\t\t\t{{ inputValue }}\n\t\t\t</div>\n\t\t",
    methods: {
      search: function search() {
        console.log(5);
        var r = muff__WEBPACK_IMPORTED_MODULE_0__["muff"].search(this.inputValue);
        console.log(r);
      }
    }
  });
  console.log(4);
  new vue_dist_vue_esm_js__WEBPACK_IMPORTED_MODULE_1__["default"]({
    el: '#muffin'
  });
  muff__WEBPACK_IMPORTED_MODULE_0__["muff"].setReturnListLength(20);
  muff__WEBPACK_IMPORTED_MODULE_0__["muff"].setSearchWordList(['aaa', 'bbb', 'ccc']);
}

/***/ })

}]);
//# sourceMappingURL=0.bundle.js.map