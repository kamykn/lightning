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

function init() {
  muff__WEBPACK_IMPORTED_MODULE_0__["muff"].setReturnListLength(20);
  vueInit();
}

function vueInit() {
  var vm = new vue_dist_vue_esm_js__WEBPACK_IMPORTED_MODULE_1__["default"]({
    el: '#muffin',
    data: {
      inputValue: '',
      currentSearchType: null,
      searchTypes: {
        history: 1,
        bookmarks: 2,
        tabs: 3
      }
    },
    methods: {
      init: function init() {
        this.currentSearchType = this.searchTypes.history; // this.setHistoryTab()

        this.setBookmarksTab(); // this.setTabsTab()
      },
      search: function search(inputValue) {
        return new Promise(function (resolve) {
          var results = muff__WEBPACK_IMPORTED_MODULE_0__["muff"].search(inputValue);
          resolve(results);
        });
      },
      setSearchResultsToData: function setSearchResultsToData(results) {
        return results.list;
      },
      setHistoryTab: function setHistoryTab() {
        this.currentSearchType = this.searchTypes.history; // 1年分

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
      setTabsTab: function setTabsTab() {
        this.currentSearchType = this.searchTypes.tabs;
        chrome.tabs.query({
          currentWindow: true
        }, function (tabs) {
          console.log(tabs);
          var searchWordList = [];
          tabs.forEach(function (tab, index) {
            searchWordList.push({
              index: tab.index.toString(),
              title: tab.title,
              url: tab.url
            });
          });
          console.log(searchWordList);
          muff__WEBPACK_IMPORTED_MODULE_0__["muff"].setSearchWordList(searchWordList);
        }); // メモ
        // すでにあるタブを開くには
        // chrome.tabs.update(tabs[i].id, {active: true});
        // https://stackoverflow.com/questions/36000099/check-if-window-is-already-open-from-a-non-parent-window-chrome-extension
      },
      setBookmarksTab: function setBookmarksTab() {
        var _this = this;

        this.currentSearchType = this.searchTypes.bookmarks;
        chrome.bookmarks.getTree(function (bookmarksTree) {
          var searchWordList = [];
          searchWordList = _this.pushBookmarkListRecursive(bookmarksTree, searchWordList);
          muff__WEBPACK_IMPORTED_MODULE_0__["muff"].setSearchWordList(searchWordList);
        });
      },
      pushBookmarkListRecursive: function pushBookmarkListRecursive(bookmarksTree, searchWordList, parentPath) {
        console.log(parentPath);

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
//# sourceMappingURL=0.bundle.js.map