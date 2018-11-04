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
			currentSearchType: null,
			searchTypes: {
				history:   1,
				bookmarks: 2,
				tabs:      3
			}
		},
		methods: {
			init() {
				this.currentSearchType = this.searchTypes.history;
				// this.setHistoryTab()
				this.setBookmarksTab()
				// this.setTabsTab()
			},
			search(inputValue) {
				return new Promise(resolve => {
					let results = muff.search(inputValue)
					resolve(results)
				})
			},
			setSearchResultsToData(results) {
				return results.list
			},
			setHistoryTab() {
				this.currentSearchType = this.searchTypes.history

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
			setTabsTab() {
				this.currentSearchType = this.searchTypes.tabs

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

					console.log(searchWordList)
					muff.setSearchWordList(searchWordList)
				});

				// メモ
				// すでにあるタブを開くには
				// chrome.tabs.update(tabs[i].id, {active: true});
				// https://stackoverflow.com/questions/36000099/check-if-window-is-already-open-from-a-non-parent-window-chrome-extension
			},
			setBookmarksTab() {
				this.currentSearchType = this.searchTypes.bookmarks

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
