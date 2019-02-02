self["webpackChunk"]([1],{

/***/ "./assets/js/comlink.js":
/*!******************************!*\
  !*** ./assets/js/comlink.js ***!
  \******************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var comlinkjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! comlinkjs */ "./node_modules/comlinkjs/comlink.js");
/* harmony import */ var muff__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! muff */ "./node_modules/muff/index.js");


const wasm = {
  // 検索件数上限
  maxSearchWordListLen: 0,
  init: async function (maxSearchWordListLen) {
    this.maxSearchWordListLen = maxSearchWordListLen; // このオブジェクトにWebAssemblyをマージして使う

    await muff__WEBPACK_IMPORTED_MODULE_1__["default"].init();
    Object.assign(wasm, muff__WEBPACK_IMPORTED_MODULE_1__["default"]);
  },

  setSearchWordListWrapper(searchWordList) {
    if (this.maxSearchWordListLen <= 0) {
      console.log('Please set "maxSearchWordListLen" over 1.');
    } // 検索件数に上限を設ける


    searchWordList = searchWordList.slice(0, this.maxSearchWordListLen);
    this.setSearchWordList(searchWordList);
  }

};
comlinkjs__WEBPACK_IMPORTED_MODULE_0__["expose"](wasm, self);

/***/ }),

/***/ "./node_modules/comlinkjs/comlink.js":
/*!*******************************************!*\
  !*** ./node_modules/comlinkjs/comlink.js ***!
  \*******************************************/
/*! exports provided: transferHandlers, proxy, proxyValue, expose */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "transferHandlers", function() { return transferHandlers; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "proxy", function() { return proxy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "proxyValue", function() { return proxyValue; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "expose", function() { return expose; });
/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const TRANSFERABLE_TYPES = ["ArrayBuffer", "MessagePort", "OffscreenCanvas"]
    .filter(f => f in self)
    .map(f => self[f]);
const uid = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
const proxyValueSymbol = Symbol("proxyValue");
const throwSymbol = Symbol("throw");
const proxyTransferHandler = {
    canHandle: (obj) => obj && obj[proxyValueSymbol],
    serialize: (obj) => {
        const { port1, port2 } = new MessageChannel();
        expose(obj, port1);
        return port2;
    },
    deserialize: (obj) => {
        return proxy(obj);
    }
};
const throwTransferHandler = {
    canHandle: (obj) => obj && obj[throwSymbol],
    serialize: (obj) => {
        const message = obj && obj.message;
        const stack = obj && obj.stack;
        return Object.assign({}, obj, { message, stack });
    },
    deserialize: (obj) => {
        throw Object.assign(Error(), obj);
    }
};
const transferHandlers = new Map([
    ["PROXY", proxyTransferHandler],
    ["THROW", throwTransferHandler]
]);
let pingPongMessageCounter = 0;
function proxy(endpoint, target) {
    if (isWindow(endpoint))
        endpoint = windowEndpoint(endpoint);
    if (!isEndpoint(endpoint))
        throw Error("endpoint does not have all of addEventListener, removeEventListener and postMessage defined");
    activateEndpoint(endpoint);
    return cbProxy(async (irequest) => {
        let args = [];
        if (irequest.type === "APPLY" || irequest.type === "CONSTRUCT")
            args = irequest.argumentsList.map(wrapValue);
        const response = await pingPongMessage(endpoint, Object.assign({}, irequest, { argumentsList: args }), transferableProperties(args));
        const result = response.data;
        return unwrapValue(result.value);
    }, [], target);
}
function proxyValue(obj) {
    obj[proxyValueSymbol] = true;
    return obj;
}
function expose(rootObj, endpoint) {
    if (isWindow(endpoint))
        endpoint = windowEndpoint(endpoint);
    if (!isEndpoint(endpoint))
        throw Error("endpoint does not have all of addEventListener, removeEventListener and postMessage defined");
    activateEndpoint(endpoint);
    attachMessageHandler(endpoint, async function (event) {
        if (!event.data.id || !event.data.callPath)
            return;
        const irequest = event.data;
        let that = await irequest.callPath
            .slice(0, -1)
            .reduce((obj, propName) => obj[propName], rootObj);
        let obj = await irequest.callPath.reduce((obj, propName) => obj[propName], rootObj);
        let iresult = obj;
        let args = [];
        if (irequest.type === "APPLY" || irequest.type === "CONSTRUCT")
            args = irequest.argumentsList.map(unwrapValue);
        if (irequest.type === "APPLY") {
            try {
                iresult = await obj.apply(that, args);
            }
            catch (e) {
                iresult = e;
                iresult[throwSymbol] = true;
            }
        }
        if (irequest.type === "CONSTRUCT") {
            try {
                iresult = new obj(...args); // eslint-disable-line new-cap
                iresult = proxyValue(iresult);
            }
            catch (e) {
                iresult = e;
                iresult[throwSymbol] = true;
            }
        }
        if (irequest.type === "SET") {
            obj[irequest.property] = irequest.value;
            // FIXME: ES6 Proxy Handler `set` methods are supposed to return a
            // boolean. To show good will, we return true asynchronously ¯\_(ツ)_/¯
            iresult = true;
        }
        iresult = makeInvocationResult(iresult);
        iresult.id = irequest.id;
        return endpoint.postMessage(iresult, transferableProperties([iresult]));
    });
}
function wrapValue(arg) {
    // Is arg itself handled by a TransferHandler?
    for (const [key, transferHandler] of transferHandlers) {
        if (transferHandler.canHandle(arg)) {
            return {
                type: key,
                value: transferHandler.serialize(arg)
            };
        }
    }
    // If not, traverse the entire object and find handled values.
    let wrappedChildren = [];
    for (const item of iterateAllProperties(arg)) {
        for (const [key, transferHandler] of transferHandlers) {
            if (transferHandler.canHandle(item.value)) {
                wrappedChildren.push({
                    path: item.path,
                    wrappedValue: {
                        type: key,
                        value: transferHandler.serialize(item.value)
                    }
                });
            }
        }
    }
    for (const wrappedChild of wrappedChildren) {
        const container = wrappedChild.path
            .slice(0, -1)
            .reduce((obj, key) => obj[key], arg);
        container[wrappedChild.path[wrappedChild.path.length - 1]] = null;
    }
    return {
        type: "RAW",
        value: arg,
        wrappedChildren
    };
}
function unwrapValue(arg) {
    if (transferHandlers.has(arg.type)) {
        const transferHandler = transferHandlers.get(arg.type);
        return transferHandler.deserialize(arg.value);
    }
    else if (isRawWrappedValue(arg)) {
        for (const wrappedChildValue of arg.wrappedChildren || []) {
            if (!transferHandlers.has(wrappedChildValue.wrappedValue.type))
                throw Error(`Unknown value type "${arg.type}" at ${wrappedChildValue.path.join(".")}`);
            const transferHandler = transferHandlers.get(wrappedChildValue.wrappedValue.type);
            const newValue = transferHandler.deserialize(wrappedChildValue.wrappedValue.value);
            replaceValueInObjectAtPath(arg.value, wrappedChildValue.path, newValue);
        }
        return arg.value;
    }
    else {
        throw Error(`Unknown value type "${arg.type}"`);
    }
}
function replaceValueInObjectAtPath(obj, path, newVal) {
    const lastKey = path.slice(-1)[0];
    const lastObj = path
        .slice(0, -1)
        .reduce((obj, key) => obj[key], obj);
    lastObj[lastKey] = newVal;
}
function isRawWrappedValue(arg) {
    return arg.type === "RAW";
}
function windowEndpoint(w) {
    if (self.constructor.name !== "Window")
        throw Error("self is not a window");
    return {
        addEventListener: self.addEventListener.bind(self),
        removeEventListener: self.removeEventListener.bind(self),
        postMessage: (msg, transfer) => w.postMessage(msg, "*", transfer)
    };
}
function isEndpoint(endpoint) {
    return ("addEventListener" in endpoint &&
        "removeEventListener" in endpoint &&
        "postMessage" in endpoint);
}
function activateEndpoint(endpoint) {
    if (isMessagePort(endpoint))
        endpoint.start();
}
function attachMessageHandler(endpoint, f) {
    // Checking all possible types of `endpoint` manually satisfies TypeScript’s
    // type checker. Not sure why the inference is failing here. Since it’s
    // unnecessary code I’m going to resort to `any` for now.
    // if(isWorker(endpoint))
    //   endpoint.addEventListener('message', f);
    // if(isMessagePort(endpoint))
    //   endpoint.addEventListener('message', f);
    // if(isOtherWindow(endpoint))
    //   endpoint.addEventListener('message', f);
    endpoint.addEventListener("message", f);
}
function detachMessageHandler(endpoint, f) {
    // Same as above.
    endpoint.removeEventListener("message", f);
}
function isMessagePort(endpoint) {
    return endpoint.constructor.name === "MessagePort";
}
function isWindow(endpoint) {
    // TODO: This doesn’t work on cross-origin iframes.
    // return endpoint.constructor.name === 'Window';
    return ["window", "length", "location", "parent", "opener"].every(prop => prop in endpoint);
}
/**
 * `pingPongMessage` sends a `postMessage` and waits for a reply. Replies are
 * identified by a unique id that is attached to the payload.
 */
function pingPongMessage(endpoint, msg, transferables) {
    const id = `${uid}-${pingPongMessageCounter++}`;
    return new Promise(resolve => {
        attachMessageHandler(endpoint, function handler(event) {
            if (event.data.id !== id)
                return;
            detachMessageHandler(endpoint, handler);
            resolve(event);
        });
        // Copy msg and add `id` property
        msg = Object.assign({}, msg, { id });
        endpoint.postMessage(msg, transferables);
    });
}
function cbProxy(cb, callPath = [], target = function () { }) {
    return new Proxy(target, {
        construct(_target, argumentsList, proxy) {
            return cb({
                type: "CONSTRUCT",
                callPath,
                argumentsList
            });
        },
        apply(_target, _thisArg, argumentsList) {
            // We use `bind` as an indicator to have a remote function bound locally.
            // The actual target for `bind()` is currently ignored.
            if (callPath[callPath.length - 1] === "bind")
                return cbProxy(cb, callPath.slice(0, -1));
            return cb({
                type: "APPLY",
                callPath,
                argumentsList
            });
        },
        get(_target, property, proxy) {
            if (property === "then" && callPath.length === 0) {
                return { then: () => proxy };
            }
            else if (property === "then") {
                const r = cb({
                    type: "GET",
                    callPath
                });
                return Promise.resolve(r).then.bind(r);
            }
            else {
                return cbProxy(cb, callPath.concat(property), _target[property]);
            }
        },
        set(_target, property, value, _proxy) {
            return cb({
                type: "SET",
                callPath,
                property,
                value
            });
        }
    });
}
function isTransferable(thing) {
    return TRANSFERABLE_TYPES.some(type => thing instanceof type);
}
function* iterateAllProperties(value, path = [], visited = null) {
    if (!value)
        return;
    if (!visited)
        visited = new WeakSet();
    if (visited.has(value))
        return;
    if (typeof value === "string")
        return;
    if (typeof value === "object")
        visited.add(value);
    if (ArrayBuffer.isView(value))
        return;
    yield { value, path };
    const keys = Object.keys(value);
    for (const key of keys)
        yield* iterateAllProperties(value[key], [...path, key], visited);
}
function transferableProperties(obj) {
    const r = [];
    for (const prop of iterateAllProperties(obj)) {
        if (isTransferable(prop.value))
            r.push(prop.value);
    }
    return r;
}
function makeInvocationResult(obj) {
    for (const [type, transferHandler] of transferHandlers) {
        if (transferHandler.canHandle(obj)) {
            const value = transferHandler.serialize(obj);
            return {
                value: { type, value }
            };
        }
    }
    return {
        value: {
            type: "RAW",
            value: obj
        }
    };
}


/***/ }),

/***/ "./node_modules/muff/index.js":
/*!************************************!*\
  !*** ./node_modules/muff/index.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const wasm = __webpack_require__.e(/*! import() */ 2).then(__webpack_require__.bind(null, /*! ./crate/pkg/muff.js */ "./node_modules/muff/crate/pkg/muff.js"))

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
//# sourceMappingURL=1.bundle.worker.js.map