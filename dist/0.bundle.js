(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[0],{

/***/ "./assets/js/index.js":
/*!****************************!*\
  !*** ./assets/js/index.js ***!
  \****************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var muff__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! muff */ \"./node_modules/muff/index.js\");\nvar _this = undefined;\n\n\nmuff__WEBPACK_IMPORTED_MODULE_0__[\"muff\"].setReturnListLength(20);\nmuff__WEBPACK_IMPORTED_MODULE_0__[\"muff\"].setSearchWordList(['aaa', 'bbb', 'ccc']);\ndocument.getElementById(\"search\").addEventListener(\"change\", function () {\n  var inputStr = _this.value;\n  muffSearch(inputStr);\n});\n\nfunction muffSearch(inputStr) {\n  var result = muff__WEBPACK_IMPORTED_MODULE_0__[\"muff\"].search(inputStr);\n  console.log(result);\n}\n\n//# sourceURL=webpack:///./assets/js/index.js?");

/***/ })

}]);