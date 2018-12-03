import { muff } from 'muff'
import Vue from 'vue/dist/vue.esm.js'
import VueRx from 'vue-rx'
import { from } from 'rxjs';
import { pluck, debounceTime, switchMap, map } from 'rxjs/operators'

import style from '../scss/style.scss'

Vue.use(VueRx)

window.onload = function() {
	init()
}

function init() {
	muff.setReturnListLength(20)
	vueInit()
}

function vueInit() {
	let vm = new Vue({
		el: '#muffin',
		data: {
			inputValue: '',
			currentSearchType: 0,
			currentSearchTypeName: '',
			searchTypes: {
				history:   1,
				bookmarks: 2,
				tabs:      3
			},
		},
		methods: {
			init() {
				this.changeToHistorySearch()
			},
			setSearchType(searchType) {
				this.currentSearchType = searchType
				Object.keys(this.searchTypes).forEach((typeName) => {
					if (this.searchTypes[typeName] == this.currentSearchType) {
						this.currentSearchTypeName = typeName;
						return
					}
				})
			},
			changeSearchType() {
				if (event) {event.preventDefault()}

				let nextSearchType = this.currentSearchType + 1
				const searchTypeList = Object.values(this.searchTypes)
				if (Math.max(...searchTypeList) < nextSearchType) {
					nextSearchType = Math.min(...searchTypeList)
				}

				Object.keys(this.searchTypes).forEach((typeName) => {
					if (this.searchTypes[typeName] == nextSearchType) {
						const upperCaseTypeName = typeName.charAt(0).toUpperCase() + typeName.slice(1);
						const method = this['changeTo' + upperCaseTypeName + 'Search']
						method.call(this)
						return
					}
				})

				this.search(this.inputValue).then((results) => {
					this.setSearchResultsToData(results)
				})
			},
			search(inputValue) {
				console.log(inputValue)
				return new Promise(resolve => {
					let results = muff.search(inputValue)
					resolve(results)
				})
			},
			setSearchResultsToData(results) {
				return results.list
			},
			changeToHistorySearch() {
				this.setSearchType(this.searchTypes.history)

				// 1年分
				const startTime = new Date().getTime() - (1000 * 60 * 60 * 24 * 265)
				const query = {
					text: '',
					startTime: startTime,
					maxResults: 50000
				}

				let historyList = []
				chrome.history.search(query, function (results) {
					const reverseResult = results.reverse()
					reverseResult.forEach(function (result) {
						// resultひとつひとつがHistoryItem形式
						historyList.push({
							url: result.url,
							title: result.title
						})
					});

					muff.setSearchWordList(historyList)
				})
			},
			changeToTabsSearch() {
				this.setSearchType(this.searchTypes.tabs)

				chrome.tabs.query({currentWindow: true}, function(tabs) {
					console.log(tabs)
					let searchWordList = []

					tabs.forEach(function(tab, index) {
						searchWordList.push({
							index: tab.index.toString(),
							title: tab.title,
							url: tab.url
						})
					});

					muff.setSearchWordList(searchWordList)
				});

				// メモ
				// すでにあるタブを開くには
				// chrome.tabs.update(tabs[i].id, {active: true});
				// https://stackoverflow.com/questions/36000099/check-if-window-is-already-open-from-a-non-parent-window-chrome-extension
			},
			changeToBookmarksSearch() {
				this.setSearchType(this.searchTypes.bookmarks)

				chrome.bookmarks.getTree((bookmarksTree) => {
					let searchWordList = []
					searchWordList = this.pushBookmarkListRecursive(bookmarksTree, searchWordList)
					muff.setSearchWordList(searchWordList)
				});
			},
			pushBookmarkListRecursive(bookmarksTree, searchWordList, parentPath) {
				console.log(parentPath)
				if (typeof parentPath == 'undefined') {
					parentPath = ''
				}

				for (let i =0; i < bookmarksTree.length; i++) {
					let bookmark = bookmarksTree[i];

					if (bookmark.url) {
						searchWordList.push({
							parentPath: parentPath, // TODO: 検索ignoreしたい
							path: parentPath + bookmark.title,
							title: bookmark.title,
							url: bookmark.url
						})
					}

					if (bookmark.children) {

						let currentPath = parentPath + bookmark.title + '/'
						searchWordList = this.pushBookmarkListRecursive(bookmark.children, searchWordList, currentPath);
					}
				}

				return searchWordList
			}
		},
		subscriptions() {
			return {
				results: this.$watchAsObservable('inputValue').pipe(
					pluck('newValue'),
					debounceTime(500),
					switchMap(this.search),
					map(this.setSearchResultsToData)
				)
			}
		}
	})

	vm.init()
}
