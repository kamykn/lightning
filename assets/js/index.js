import { muff } from 'muff'
import Vue from 'vue/dist/vue.esm.js'
import VueRx from 'vue-rx'
import { from } from 'rxjs';
import { pluck, debounceTime, switchMap, map } from 'rxjs/operators'
import '@babel/polyfill'

import style from '../scss/style.scss'

Vue.use(VueRx)

let vm = new Vue({
	data: {
		inputString: '',
		currentSelected: -1, // 結果配列のindexなので選択されていない状態は-1とする
		currentSearchType: 0,
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
	mounted() {
		// 結果の数を設定
		muff.setReturnListLength(20)
		// 初期モードはHistory
		this.changeToHistorySearch()
	},
	methods: {
		setSearchType(searchType) {
			this.currentSearchType = searchType
		},
		nextSearchType(event) {
			const searchTypeList = Object.values(this.searchTypes)
			let nextSearchType = this.currentSearchType + 1
			if (nextSearchType > Math.max(...searchTypeList)) {
				nextSearchType = Math.min(...searchTypeList)
			}

			this.setNewSearchType(nextSearchType)
		},
		prevSearchType(event) {
			const searchTypeList = Object.values(this.searchTypes)
			let nextSearchType = this.currentSearchType - 1
			if (nextSearchType < Math.min(...searchTypeList)) {
				nextSearchType = Math.max(...searchTypeList)
			}

			this.setNewSearchType(nextSearchType)
		},
		setNewSearchType (nextSearchType) {
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
				const results = await this.search(this.inputString)
				this.results = this.setSearchResultsToData(results)
			})()
		},
		search(inputString) {
			return new Promise(resolve => {
				let results = muff.search(inputString)
				resolve(results)
			})
		},
		setSearchResultsToData(results) {
			// リストの選択中の位置を調整
			if (Array.isArray(results)) {
				this.currentSelected = Math.min(this.currentSelected, results.length - 1)
			}

			return results
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
					console.log(searchWordList)
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
		resetCurrentSelector() {
			this.currentSelected = -1
		},
		moveUpSelector(event) {
			if (this.currentSelected > 0) {
				this.currentSelected--
				this.resultRestScroll()
			}
		},
		moveDownSelector(event) {
			if (Array.isArray(this.results) && this.currentSelected < this.results.length - 1) {
				this.currentSelected++
				this.resultRestScroll()
			}
		},
		resultRestScroll() {
			this.$nextTick(() => {
				const selectedLi = document.getElementsByClassName('currentSelected')[0]
				if (typeof selectedLi != 'undefined') {
					selectedLi.scrollIntoView({behavior: "instant", block: "nearest"})
				}
			})
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
			results: this.$watchAsObservable('inputString').pipe(
				pluck('newValue'),
				debounceTime(500),
				switchMap(this.search),
				map(this.setSearchResultsToData)
			)
		}
	},
	directives: {
		focus: {
			// ディレクティブ定義
			inserted: function (el) {
				el.focus()
			}
		}
	}
})

window.onload = () => {
	vm.$mount('#muffin')
}
