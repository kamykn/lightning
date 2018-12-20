(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[1],{

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
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }







vue_dist_vue_esm_js__WEBPACK_IMPORTED_MODULE_1__["default"].use(vue_rx__WEBPACK_IMPORTED_MODULE_2__["default"]);

window.onload = function () {
  init();
};

function init() {
  muff__WEBPACK_IMPORTED_MODULE_0__["muff"].setReturnListLength(20);
  vueInit();
}

function vueInit() {
  var vm = new vue_dist_vue_esm_js__WEBPACK_IMPORTED_MODULE_1__["default"]({
    el: '#muffin',
    data: {
      inputValue: '',
      currentSearchType: 0,
      currentSearchTypeName: '',
      currentSelected: -1,
      searchTypes: {
        HISTORY: 1,
        BOOKMARKS: 2,
        TABS: 3
      }
    },
    filters: {
      toUpperFirst: function toUpperFirst(text) {
        text = text.toString();
        return text.toString().charAt(0).toUpperCase() + text.slice(1).toLowerCase();
      },
      toLowerCase: function toLowerCase(text) {
        return text.toString().toLowerCase();
      }
    },
    methods: {
      init: function init() {
        this.changeToHistorySearch();
      },
      setSearchType: function setSearchType(searchType) {
        var _this = this;

        this.currentSearchType = searchType;
        Object.keys(this.searchTypes).forEach(function (typeName) {
          if (_this.searchTypes[typeName] == _this.currentSearchType) {
            _this.currentSearchTypeName = typeName;
            return;
          }
        });
      },
      changeSearchType: function changeSearchType() {
        var _this2 = this;

        if (event) {
          event.preventDefault();
        }

        var nextSearchType = this.currentSearchType + 1;
        var searchTypeList = Object.values(this.searchTypes);

        if (Math.max.apply(Math, _toConsumableArray(searchTypeList)) < nextSearchType) {
          nextSearchType = Math.min.apply(Math, _toConsumableArray(searchTypeList));
        }

        Object.keys(this.searchTypes).forEach(function (typeName) {
          if (_this2.searchTypes[typeName] == nextSearchType) {
            var upperCaseTypeName = typeName.charAt(0).toUpperCase() + typeName.slice(1);
            var method = _this2['changeTo' + upperCaseTypeName + 'Search'];
            method.call(_this2);
            return;
          }
        });
        this.search(this.inputValue).then(function (results) {
          _this2.setSearchResultsToData(results);
        });
      },
      search: function search(inputValue) {
        return new Promise(function (resolve) {
          var results = muff__WEBPACK_IMPORTED_MODULE_0__["muff"].search(inputValue);
          resolve(results);
        });
      },
      setSearchResultsToData: function setSearchResultsToData(results) {
        if (Array.isArray(results.list)) {
          this.currentSelected = Math.min(this.currentSelected, results.list.length - 1);
        }

        return results.list;
      },
      changeToHistorySearch: function changeToHistorySearch() {
        this.setSearchType(this.searchTypes.HISTORY); // 1年分

        var startTime = new Date().getTime() - 1000 * 60 * 60 * 24 * 265;
        var query = {
          text: '',
          startTime: startTime,
          maxResults: 50000
        };
        var historyList = [];
        chrome.history.search(query, function (results) {
          var reverseResult = results.reverse();
          reverseResult.forEach(function (result) {
            // resultひとつひとつがHistoryItem形式
            historyList.push({
              url: result.url,
              title: result.title
            });
          });
          muff__WEBPACK_IMPORTED_MODULE_0__["muff"].setSearchWordList(historyList);
        });
      },
      changeToTabsSearch: function changeToTabsSearch() {
        this.setSearchType(this.searchTypes.TABS);
        chrome.tabs.query({
          currentWindow: true
        }, function (tabs) {
          var searchWordList = [];
          tabs.forEach(function (tab, index) {
            searchWordList.push({
              index: tab.index.toString(),
              id: tab.id.toString(),
              title: tab.title,
              url: tab.url
            });
          });
          muff__WEBPACK_IMPORTED_MODULE_0__["muff"].setSearchWordList(searchWordList);
        });
      },
      changeToBookmarksSearch: function changeToBookmarksSearch() {
        var _this3 = this;

        this.setSearchType(this.searchTypes.BOOKMARKS);
        chrome.bookmarks.getTree(function (bookmarksTree) {
          var searchWordList = [];
          searchWordList = _this3.pushBookmarkListRecursive(bookmarksTree, searchWordList);
          muff__WEBPACK_IMPORTED_MODULE_0__["muff"].setSearchWordList(searchWordList);
        });
      },
      pushBookmarkListRecursive: function pushBookmarkListRecursive(bookmarksTree, searchWordList, parentPath) {
        if (typeof parentPath == 'undefined') {
          parentPath = '';
        }

        for (var i = 0; i < bookmarksTree.length; i++) {
          var bookmark = bookmarksTree[i];

          if (bookmark.url) {
            searchWordList.push({
              parentPath: parentPath,
              // TODO: 検索ignoreしたい
              path: parentPath + bookmark.title,
              title: bookmark.title,
              url: bookmark.url
            });
          }

          if (bookmark.children) {
            var currentPath = parentPath + bookmark.title + '/';
            searchWordList = this.pushBookmarkListRecursive(bookmark.children, searchWordList, currentPath);
          }
        }

        return searchWordList;
      },
      moveSelector: function moveSelector(type, event) {
        if (event) event.preventDefault();

        if (type == "down") {
          if (Array.isArray(this.results) && this.currentSelected < this.results.length - 1) {
            this.currentSelected++;
          }
        } else if (type == "up") {
          if (this.currentSelected > 0) {
            this.currentSelected--;
          }
        }
      },
      select: function select() {
        var currentSelected = Math.max(this.currentSelected, 0);

        if (typeof this.results[currentSelected] != 'undefined') {
          if (this.currentSearchType == this.searchTypes.HISTORY || this.currentSearchType == this.searchTypes.BOOKMARKS) {
            window.open(this.results[currentSelected].url);
          } else if (this.currentSearchType == this.searchTypes.TABS) {
            // https://stackoverflow.com/questions/36000099/check-if-window-is-already-open-from-a-non-parent-window-chrome-extension
            chrome.tabs.update(parseInt(this.results[currentSelected].id), {
              active: true
            });
          }
        }
      }
    },
    subscriptions: function subscriptions() {
      return {
        results: this.$watchAsObservable('inputValue').pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["pluck"])('newValue'), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["debounceTime"])(500), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["switchMap"])(this.search), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(this.setSearchResultsToData))
      };
    }
  });
  vm.init();
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
//# sourceMappingURL=1.bundle.js.map