(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[1],{

/***/ "./node_modules/muff-wasm/muff_wasm.js":
/*!*********************************************!*\
  !*** ./node_modules/muff-wasm/muff_wasm.js ***!
  \*********************************************/
/*! exports provided: setSearchWordList, setReturnListLength, wazf, __wbindgen_throw */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"setSearchWordList\", function() { return setSearchWordList; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"setReturnListLength\", function() { return setReturnListLength; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"wazf\", function() { return wazf; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__wbindgen_throw\", function() { return __wbindgen_throw; });\n/* harmony import */ var _muff_wasm_bg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./muff_wasm_bg */ \"./node_modules/muff-wasm/muff_wasm_bg.wasm\");\n/* tslint:disable */\n\n\nlet cachedEncoder = new TextEncoder('utf-8');\n\nlet cachegetUint8Memory = null;\nfunction getUint8Memory() {\n    if (cachegetUint8Memory === null || cachegetUint8Memory.buffer !== _muff_wasm_bg__WEBPACK_IMPORTED_MODULE_0__[\"memory\"].buffer) {\n        cachegetUint8Memory = new Uint8Array(_muff_wasm_bg__WEBPACK_IMPORTED_MODULE_0__[\"memory\"].buffer);\n    }\n    return cachegetUint8Memory;\n}\n\nfunction passStringToWasm(arg) {\n\n    const buf = cachedEncoder.encode(arg);\n    const ptr = _muff_wasm_bg__WEBPACK_IMPORTED_MODULE_0__[\"__wbindgen_malloc\"](buf.length);\n    getUint8Memory().set(buf, ptr);\n    return [ptr, buf.length];\n}\n/**\n* @param {string} arg0\n* @returns {void}\n*/\nfunction setSearchWordList(arg0) {\n    const [ptr0, len0] = passStringToWasm(arg0);\n    try {\n        return _muff_wasm_bg__WEBPACK_IMPORTED_MODULE_0__[\"setSearchWordList\"](ptr0, len0);\n\n    } finally {\n        _muff_wasm_bg__WEBPACK_IMPORTED_MODULE_0__[\"__wbindgen_free\"](ptr0, len0 * 1);\n\n    }\n\n}\n\n/**\n* @param {number} arg0\n* @returns {void}\n*/\nfunction setReturnListLength(arg0) {\n    return _muff_wasm_bg__WEBPACK_IMPORTED_MODULE_0__[\"setReturnListLength\"](arg0);\n}\n\nlet cachedDecoder = new TextDecoder('utf-8');\n\nfunction getStringFromWasm(ptr, len) {\n    return cachedDecoder.decode(getUint8Memory().subarray(ptr, ptr + len));\n}\n\nlet cachedGlobalArgumentPtr = null;\nfunction globalArgumentPtr() {\n    if (cachedGlobalArgumentPtr === null) {\n        cachedGlobalArgumentPtr = _muff_wasm_bg__WEBPACK_IMPORTED_MODULE_0__[\"__wbindgen_global_argument_ptr\"]();\n    }\n    return cachedGlobalArgumentPtr;\n}\n\nlet cachegetUint32Memory = null;\nfunction getUint32Memory() {\n    if (cachegetUint32Memory === null || cachegetUint32Memory.buffer !== _muff_wasm_bg__WEBPACK_IMPORTED_MODULE_0__[\"memory\"].buffer) {\n        cachegetUint32Memory = new Uint32Array(_muff_wasm_bg__WEBPACK_IMPORTED_MODULE_0__[\"memory\"].buffer);\n    }\n    return cachegetUint32Memory;\n}\n/**\n* @param {string} arg0\n* @returns {string}\n*/\nfunction wazf(arg0) {\n    const [ptr0, len0] = passStringToWasm(arg0);\n    const retptr = globalArgumentPtr();\n    try {\n        _muff_wasm_bg__WEBPACK_IMPORTED_MODULE_0__[\"wazf\"](retptr, ptr0, len0);\n        const mem = getUint32Memory();\n        const rustptr = mem[retptr / 4];\n        const rustlen = mem[retptr / 4 + 1];\n\n        const realRet = getStringFromWasm(rustptr, rustlen).slice();\n        _muff_wasm_bg__WEBPACK_IMPORTED_MODULE_0__[\"__wbindgen_free\"](rustptr, rustlen * 1);\n        return realRet;\n\n\n    } finally {\n        _muff_wasm_bg__WEBPACK_IMPORTED_MODULE_0__[\"__wbindgen_free\"](ptr0, len0 * 1);\n\n    }\n\n}\n\nfunction __wbindgen_throw(ptr, len) {\n    throw new Error(getStringFromWasm(ptr, len));\n}\n\n\n\n//# sourceURL=webpack:///./node_modules/muff-wasm/muff_wasm.js?");

/***/ }),

/***/ "./node_modules/muff-wasm/muff_wasm_bg.wasm":
/*!**************************************************!*\
  !*** ./node_modules/muff-wasm/muff_wasm_bg.wasm ***!
  \**************************************************/
/*! exports provided: memory, __indirect_function_table, __heap_base, __data_end, __wbindgen_global_argument_ptr, setSearchWordList, setReturnListLength, wazf, __wbindgen_malloc, __wbindgen_free */
/***/ (function(module, exports, __webpack_require__) {

eval("\"use strict\";\n// Instantiate WebAssembly module\nvar wasmExports = __webpack_require__.w[module.i];\n__webpack_require__.r(exports);\n// export exports from WebAssembly module\nfor(var name in wasmExports) if(name != \"__webpack_init__\") exports[name] = wasmExports[name];\n// exec imports from WebAssembly module (for esm order)\n/* harmony import */ var m0 = __webpack_require__(/*! ./muff_wasm */ \"./node_modules/muff-wasm/muff_wasm.js\");\n\n\n// exec wasm module\nwasmExports[\"__webpack_init__\"]()\n\n//# sourceURL=webpack:///./node_modules/muff-wasm/muff_wasm_bg.wasm?");

/***/ }),

/***/ "./node_modules/muff/index.js":
/*!************************************!*\
  !*** ./node_modules/muff/index.js ***!
  \************************************/
/*! exports provided: muff */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"muff\", function() { return muff; });\n/* harmony import */ var muff_wasm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! muff-wasm */ \"./node_modules/muff-wasm/muff_wasm.js\");\n\n\nclass Muff {\n\tconstructor(wasm) {\n\t\tthis.wasm = wasm\n\t}\n\n\tsetReturnListLength(listCount) {\n\t\tthis.wasm.setReturnListLength(listCount)\n\t}\n\n\tsetSearchWordList(searchWordList) {\n\t\tthis.wasm.setSearchWordList(JSON.stringify({list: searchWordList}))\n\t}\n\n\tsearch(inputWord) {\n\t\treturn JSON.parse(this.wasm.wazf(inputWord))\n\t}\n}\n\nlet muff = new Muff(muff_wasm__WEBPACK_IMPORTED_MODULE_0__)\n\n\n\n\n//# sourceURL=webpack:///./node_modules/muff/index.js?");

/***/ })

}]);