import Vue from 'vue/dist/vue.esm.js'
import VueRx from 'vue-rx'
import { from } from 'rxjs';
import { pluck, debounceTime, switchMap, map } from 'rxjs/operators'
import '@babel/polyfill'
import * as Comlink from 'comlinkjs'

import style from '../scss/style.scss'

let worker = new Worker('./worker.js', { type: 'module' })
let Muff = Comlink.proxy(worker)

Vue.use(VueRx)

let vm = new Vue({
	data: {
		inputString: '',
		currentSelected: -1, // 結果配列のindexなので選択されていない状態は-1とする
		currentSearchType: -1,
		returnListLength: 30,
		hitLength: 0,
		searchTypes: {
			HISTORY:   1,
			BOOKMARKS: 2,
			TABS:      3
		},
		listCache: {},
		searchCache: {},
		isShortcutVisible: false,
		maxSearchWordListLen: 20000,
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
	async created() {
		// 結果の数を設定
		await Muff.init(this.maxSearchWordListLen)
		await Muff.setReturnListLength(this.returnListLength)

		// 初期モード
		this.setNewSearchType(this.searchTypes.HISTORY)
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
			if (this.currentSearchType == nextSearchType) {
				return
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
					default:
						console.log('Unknown Search Type.')
						return;
				}
				const results = await this.search(this.inputString, nextSearchType)
				this.results = this.setSearchResultsToData(results)
				this.setSearchType(nextSearchType)
				this.hitLength = this.listCache[this.currentSearchType].length
				this.scrollIntoView()
			})()
		},
		async search(inputString, nextSearchType) {
			// キャッシュが残っていれば返却
			if (typeof this.searchCache[inputString] != 'undefined' && 
				typeof this.searchCache[inputString][nextSearchType] != 'undefined'
			) {
				return Promise.resolve(this.searchCache[inputString][nextSearchType])
			}

			// 検索
			let results = await Muff.search(inputString)
			this.hitLength = await Muff.getHitLength()

			if (typeof this.searchCache[inputString] == 'undefined') {
				// キャッシュはsearchTypeにつき1つのみ生成される
				this.searchCache[inputString] = {}
				// 新たに入力した場合は結果表示優先する
				this.isShortcutVisible = false
			}

			this.searchCache[inputString][nextSearchType] = results
			return Promise.resolve(results)
		},
		setSearchResultsToData(results) {
			// リストの選択中の位置を調整
			if (Array.isArray(results)) {
				this.currentSelected = Math.min(this.currentSelected, results.length - 1)
			}

			return results
		},
		changeToHistorySearch() {
			return new Promise(async (resolve) => {
				// 1年分
				const startTime = new Date().getTime() - (1000 * 60 * 60 * 24 * 265)
				const query = {
					text: '',
					startTime: startTime,
					maxResults: 50000
				};

				let historyList = []
				if (typeof this.listCache[this.searchTypes.HISTORY] != 'undefined') {
					historyList = this.listCache[this.searchTypes.HISTORY]
				} else {
					await (() => {
						return new Promise(resolve2 => {
							chrome.history.search(query, (results) => {
								const reverseResult = results.reverse()
								reverseResult.forEach((result) => {
									// resultひとつひとつがHistoryItem形式
									const [url, protocol] = this.separateProtocol(result.url)
									historyList.push({
										_protocol: protocol,
										url: this.escapeHtml(url),
										title: this.escapeHtml(result.title),
									})
								});

								resolve2()
							})
						})
					})()
					this.listCache[this.searchTypes.HISTORY] = historyList
				}

				await Muff.setSearchWordListWrapper(historyList)
				resolve()
			})
		},
		changeToTabsSearch() {
			return new Promise(async (resolve) => {
				let searchWordList = []
				if (typeof this.listCache[this.searchTypes.TABS] != 'undefined') {
					searchWordList = this.listCache[this.searchTypes.TABS]
				} else {
					await (() => {
						return new Promise(resolve2 => {
							chrome.tabs.query({currentWindow: true}, (tabs) => {
								tabs.forEach((tab, index) => {
									const [url, protocol] = this.separateProtocol(tab.url)
									searchWordList.push({
										_index: tab.index.toString(),
										_id: tab.id.toString(),
										_icon: tab.favIconUrl,
										_protocol: protocol,
										title: this.escapeHtml(tab.title),
										url: this.escapeHtml(url),
									})
								})

								resolve2()
							})
						})
					})()
					this.listCache[this.searchTypes.TABS] = searchWordList
				}

				await Muff.setSearchWordListWrapper(searchWordList)
				resolve()
			})
		},
		changeToBookmarksSearch() {
			return new Promise(async (resolve) => {
				let searchWordList = []
				if (typeof this.listCache[this.searchTypes.BOOKMARKS] != 'undefined') {
					searchWordList = this.listCache[this.searchTypes.BOOKMARKS]
				} else {
					await (() => {
						return new Promise(resolve2 => {
							chrome.bookmarks.getTree((bookmarksTree) => {
								searchWordList = this.pushBookmarkListRecursive(bookmarksTree, searchWordList)
								resolve2()
							})
						})
					})()
					this.listCache[this.searchTypes.BOOKMARKS] = searchWordList
				}

				await Muff.setSearchWordListWrapper(searchWordList)
				resolve()
			})
		},
		pushBookmarkListRecursive(bookmarksTree, searchWordList, parentPath) {
			if (typeof parentPath == 'undefined') {
				parentPath = ''
			}

			for (let i = 0; i < bookmarksTree.length; i++) {
				let bookmark = bookmarksTree[i];

				if (bookmark.url) {
					const [url, protocol] = this.separateProtocol(bookmark.url)
					searchWordList.push({
						_parentPath: parentPath,
						_protocol: protocol,
						path: this.escapeHtml(parentPath + bookmark.title),
						title: this.escapeHtml(bookmark.title),
						url: this.escapeHtml(url)
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
			if (this.currentSelected == 0) {
				// 一番下へ
				this.currentSelected = this.results.length - 1
			} else {
				this.currentSelected--
			}

			this.scrollIntoView()
		},
		moveDownSelector(event) {
			if (Array.isArray(this.results) && this.currentSelected == this.results.length - 1) {
				// 一番上へ
				this.currentSelected = 0
			} else {
				this.currentSelected++
			}

			this.scrollIntoView()
		},
		scrollIntoView() {
			this.$nextTick(() => {
				const selectedLi = document.getElementsByClassName('current-selected')[0]
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
					const result = this.results[currentSelected]
					window.open(result.matches._protocol + result.matches.url)
				} else if (this.currentSearchType == this.searchTypes.TABS) {
					// https://stackoverflow.com/questions/36000099/check-if-window-is-already-open-from-a-non-parent-window-chrome-extension
					chrome.tabs.update(parseInt(this.results[currentSelected].matches._id), {active: true})
				}
			}
		},
		separateProtocol(url) {
			// 検索対象から除外したい物があれば追加
			let protocol = ''
			let protocolRemoved = url

			if (url.indexOf('http://') === 0) {
				protocol = 'http://'
			} else if (url.indexOf('https://') === 0) {
				protocol = 'https://'
			}

			if (protocol !== '') {
				protocolRemoved = url.replace(protocol, '')
			}

			return [protocolRemoved, protocol]
		},
		escapeHtml(string) {
			if(typeof string !== 'string') {
				return string;
			}

			return string.replace(/[&'`"<>]/g, (match) => {
				return {
					'&': '&amp;',
					"'": '&#x27;',
					'`': '&#x60;',
					'"': '&quot;',
					'<': '&lt;',
					'>': '&gt;',
				}[match]
			});
		},
		toggleShortcutVisible() {
			this.isShortcutVisible = !this.isShortcutVisible
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
	},
})

window.onload = () => {
	vm.$mount('#muffin')
}
