self["webpackChunk"]([3],{

/***/ "./node_modules/muff/crate/pkg/muff.js":
/*!*********************************************!*\
  !*** ./node_modules/muff/crate/pkg/muff.js ***!
  \*********************************************/
/*! exports provided: setSearchWordList, setReturnListLength, fuzzyMatch, getHitLength */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setSearchWordList", function() { return setSearchWordList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setReturnListLength", function() { return setReturnListLength; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fuzzyMatch", function() { return fuzzyMatch; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getHitLength", function() { return getHitLength; });
/* harmony import */ var _muff_bg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./muff_bg */ "./node_modules/muff/crate/pkg/muff_bg.wasm");
/* tslint:disable */


let cachedTextEncoder = new TextEncoder('utf-8');

let cachegetUint8Memory = null;
function getUint8Memory() {
    if (cachegetUint8Memory === null || cachegetUint8Memory.buffer !== _muff_bg__WEBPACK_IMPORTED_MODULE_0__["memory"].buffer) {
        cachegetUint8Memory = new Uint8Array(_muff_bg__WEBPACK_IMPORTED_MODULE_0__["memory"].buffer);
    }
    return cachegetUint8Memory;
}

let WASM_VECTOR_LEN = 0;

function passStringToWasm(arg) {

    const buf = cachedTextEncoder.encode(arg);
    const ptr = _muff_bg__WEBPACK_IMPORTED_MODULE_0__["__wbindgen_malloc"](buf.length);
    getUint8Memory().set(buf, ptr);
    WASM_VECTOR_LEN = buf.length;
    return ptr;
}
/**
* @param {string} arg0
* @returns {void}
*/
function setSearchWordList(arg0) {
    const ptr0 = passStringToWasm(arg0);
    const len0 = WASM_VECTOR_LEN;
    try {
        return _muff_bg__WEBPACK_IMPORTED_MODULE_0__["setSearchWordList"](ptr0, len0);

    } finally {
        _muff_bg__WEBPACK_IMPORTED_MODULE_0__["__wbindgen_free"](ptr0, len0 * 1);

    }

}

/**
* @param {number} arg0
* @returns {void}
*/
function setReturnListLength(arg0) {
    return _muff_bg__WEBPACK_IMPORTED_MODULE_0__["setReturnListLength"](arg0);
}

let cachedTextDecoder = new TextDecoder('utf-8');

function getStringFromWasm(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory().subarray(ptr, ptr + len));
}

let cachedGlobalArgumentPtr = null;
function globalArgumentPtr() {
    if (cachedGlobalArgumentPtr === null) {
        cachedGlobalArgumentPtr = _muff_bg__WEBPACK_IMPORTED_MODULE_0__["__wbindgen_global_argument_ptr"]();
    }
    return cachedGlobalArgumentPtr;
}

let cachegetUint32Memory = null;
function getUint32Memory() {
    if (cachegetUint32Memory === null || cachegetUint32Memory.buffer !== _muff_bg__WEBPACK_IMPORTED_MODULE_0__["memory"].buffer) {
        cachegetUint32Memory = new Uint32Array(_muff_bg__WEBPACK_IMPORTED_MODULE_0__["memory"].buffer);
    }
    return cachegetUint32Memory;
}
/**
* @param {string} arg0
* @returns {string}
*/
function fuzzyMatch(arg0) {
    const ptr0 = passStringToWasm(arg0);
    const len0 = WASM_VECTOR_LEN;
    const retptr = globalArgumentPtr();
    try {
        _muff_bg__WEBPACK_IMPORTED_MODULE_0__["fuzzyMatch"](retptr, ptr0, len0);
        const mem = getUint32Memory();
        const rustptr = mem[retptr / 4];
        const rustlen = mem[retptr / 4 + 1];

        const realRet = getStringFromWasm(rustptr, rustlen).slice();
        _muff_bg__WEBPACK_IMPORTED_MODULE_0__["__wbindgen_free"](rustptr, rustlen * 1);
        return realRet;


    } finally {
        _muff_bg__WEBPACK_IMPORTED_MODULE_0__["__wbindgen_free"](ptr0, len0 * 1);

    }

}

/**
* @returns {number}
*/
function getHitLength() {
    return _muff_bg__WEBPACK_IMPORTED_MODULE_0__["getHitLength"]();
}



/***/ }),

/***/ "./node_modules/muff/crate/pkg/muff_bg.wasm":
/*!**************************************************!*\
  !*** ./node_modules/muff/crate/pkg/muff_bg.wasm ***!
  \**************************************************/
/*! exports provided: memory, setSearchWordList, setReturnListLength, fuzzyMatch, getHitLength, __wbindgen_global_argument_ptr, __wbindgen_malloc, __wbindgen_free */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Instantiate WebAssembly module
var wasmExports = __webpack_require__.w[module.i];
__webpack_require__.r(exports);
// export exports from WebAssembly module
for(var name in wasmExports) if(name != "__webpack_init__") exports[name] = wasmExports[name];
// exec imports from WebAssembly module (for esm order)


// exec wasm module
wasmExports["__webpack_init__"]()

/***/ })

});
//# sourceMappingURL=3.bundle.worker.js.map