self["webpackChunk"]([2],{

/***/ "./node_modules/muff/index.js":
/*!************************************!*\
  !*** ./node_modules/muff/index.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const wasm = __webpack_require__.e(/*! import() */ 3).then(__webpack_require__.bind(null, /*! ./crate/pkg/muff.js */ "./node_modules/muff/crate/pkg/muff.js"))

var Muff = {
	wasm: null,

	init: async function() {
		Muff.wasm = await wasm
		return Promise.resolve()
	},

	setReturnListLength: function(listCount) {
		this.wasm.setReturnListLength(listCount)
	},

	setSearchWordList: function(searchWordList) {
		this.wasm.setSearchWordList(JSON.stringify(searchWordList))
	},

	search: function(inputWord) {
		return JSON.parse(this.wasm.fuzzyMatch(inputWord))
	},

	getHitLength: function() {
		return this.wasm.getHitLength()
	}
}

/* harmony default export */ __webpack_exports__["default"] = (Muff);



/***/ })

});
//# sourceMappingURL=2.bundle.worker.js.map