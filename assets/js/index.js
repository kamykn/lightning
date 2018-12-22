import { muff } from 'muff'
import Vue from 'vue/dist/vue.esm.js'
import VueRx from 'vue-rx'
import { from } from 'rxjs';
import { pluck, debounceTime, switchMap, map } from 'rxjs/operators'
import '@babel/polyfill'

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
			currentSelected: -1, // TODO ul li領域オンマウスでデフォルトに戻したい
			searchTypes: {
				HISTORY:   1,
				BOOKMARKS: 2,
				TABS:      3
			},
		},
		filters: {
			toUpperFirst : (text) => {
				text = text.toString()
				return text.toString().charAt(0).toUpperCase() + text.slice(1).toLowerCase()
			},
			toLowerCase : (text) => {
				return text.toString().toLowerCase()
			}
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
			changeSearchType(event) {
				if (event) {event.preventDefault()}

				let nextSearchType = this.currentSearchType + 1
				const searchTypeList = Object.values(this.searchTypes)
				if (Math.max(...searchTypeList) < nextSearchType) {
					nextSearchType = Math.min(...searchTypeList)
				}

				(async () => {
					switch (nextSearchType) {
						case this.searchTypes.HISTORY:
							await this.changeToHistorySearch()
							break;
						case this.searchTypes.BOOKMARKS:
							await this.changeToBookmarksSearch()
							break;
						case this.searchTypes.TABS:
							await this.changeToTabsSearch()
							break;
					}
					const results = await this.search(this.inputValue)
					this.results = this.setSearchResultsToData(results)
				})()
			},
			search(inputValue) {
				return new Promise(resolve => {
					let results = muff.search(inputValue)
					resolve(results)
				})
			},
			setSearchResultsToData(results) {
				// リストの選択中の位置を調整
				if (Array.isArray(results.list)) {
					this.currentSelected = Math.min(this.currentSelected, results.list.length - 1)
				}

				return results.list
			},
			changeToHistorySearch() {
				return new Promise(resolve => {
					this.setSearchType(this.searchTypes.HISTORY)

					// 1年分
					const startTime = new Date().getTime() - (1000 * 60 * 60 * 24 * 265)
					const query = {
						text: '',
						startTime: startTime,
						maxResults: 50000
					}

					let historyList = []
					chrome.history.search(query, (results) => {
						const reverseResult = results.reverse()
						reverseResult.forEach((result) => {
							// resultひとつひとつがHistoryItem形式
							historyList.push({
								url: result.url,
								title: result.title
							})
						});

						muff.setSearchWordList(historyList)
						resolve()
					})
				})
			},
			changeToTabsSearch() {
				return new Promise(resolve => {
					this.setSearchType(this.searchTypes.TABS)

					chrome.tabs.query({currentWindow: true}, (tabs) => {
						let searchWordList = []

						tabs.forEach((tab, index) => {
							searchWordList.push({
								index: tab.index.toString(),
								id: tab.id.toString(),
								title: tab.title,
								url: tab.url
							})
						})

						muff.setSearchWordList(searchWordList)
						resolve()
					})
				})
			},
			changeToBookmarksSearch() {
				return new Promise(resolve => {
					this.setSearchType(this.searchTypes.BOOKMARKS)

					chrome.bookmarks.getTree((bookmarksTree) => {
						let searchWordList = []
						searchWordList = this.pushBookmarkListRecursive(bookmarksTree, searchWordList)
						muff.setSearchWordList(searchWordList)
						resolve()
					})
				})
			},
			pushBookmarkListRecursive(bookmarksTree, searchWordList, parentPath) {
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
						searchWordList = this.pushBookmarkListRecursive(bookmark.children, searchWordList, currentPath)
					}
				}

				return searchWordList
			},
			moveSelector(type, event) {
				if (event) event.preventDefault()

				if (type == "down") {
					if (Array.isArray(this.results) && this.currentSelected < this.results.length - 1) {
						this.currentSelected++
					}
				} else if (type == "up") {
					if (this.currentSelected > 0) {
						this.currentSelected--
					}
				}
			},
			select() {
				let currentSelected = Math.max(this.currentSelected, 0)
				if (typeof this.results[currentSelected] != 'undefined') {
					if (this.currentSearchType == this.searchTypes.HISTORY ||
						this.currentSearchType == this.searchTypes.BOOKMARKS
					) {
						window.open(this.results[currentSelected].url)
					} else if (this.currentSearchType == this.searchTypes.TABS) {
						// https://stackoverflow.com/questions/36000099/check-if-window-is-already-open-from-a-non-parent-window-chrome-extension
						chrome.tabs.update(parseInt(this.results[currentSelected].id), {active: true})
					}
				}
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
