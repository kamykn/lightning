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
	// setHistoryTab();
	setBookmarksTab();
	muff.setReturnListLength(20)

	vueInit();
}

function setBookmarksTab() {
	chrome.bookmarks.getTree((bookmarksTree) => {
		let searchWordList = []
		searchWordList = pushBookmarkListRecursive(bookmarksTree, searchWordList)
		console.log(searchWordList)
		muff.setSearchWordList(searchWordList)
	});
}

function pushBookmarkListRecursive(bookmarksTree, searchWordList) {
	for (let i =0; i < bookmarksTree.length; i++) {
		let bookmark = bookmarksTree[i];

		if (bookmark.url) {
			searchWordList.push({
				// path: bookmark.index,
				title: bookmark.title,
				url: bookmark.url
			})
		}

		if (bookmark.children) {
			searchWordList = pushBookmarkListRecursive(bookmark.children, searchWordList);
		}
	}

	return searchWordList
}

function setHistoryTab() {
	// 1年分
	const startTime = new Date().getTime() - (1000 * 60 * 60 * 24 * 265)
	const query = {
		text: '',
		startTime: startTime,
		maxResults: 50000
	}

	let historyList = []
	chrome.history.search(query, function (results) {
		// resultsは配列なので、forEach()関数を実行することが出来る
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
}

function vueInit() {
	new Vue({
		el: '#muffin',
		data: {
			inputValue: ''
		},
		methods: {
			search(inputValue) {
				return new Promise(resolve => {
					let results = muff.search(inputValue)
					resolve(results)
				})
			},
			setData(results) {
				return results.list
			}
		},
		subscriptions() {
			return {
				results: this.$watchAsObservable('inputValue').pipe(
					pluck('newValue'),
					debounceTime(500),
					switchMap(this.search),
					map(this.setData)
				)
			}
		}
	})
}
