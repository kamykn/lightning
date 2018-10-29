import { muff } from "muff"
import Vue from "vue/dist/vue.esm.js"
import VueRx from 'vue-rx'
import { from } from 'rxjs';
import { pluck, debounceTime, switchMap, map } from 'rxjs/operators'

Vue.use(VueRx)

window.onload = function() {
	init()
}

let vm = null;

function init() {

	vm = new Vue({
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
					debounceTime(100),
					switchMap(this.search),
					map(this.setData)
				)
			}
		}
	})

	const startTime = new Date().getTime() - (1000 * 60 * 60 * 24 * 265)
	const query = {
		text: '',
		startTime: startTime,
		maxResults: 1000000
	}
	let historyList = []
	chrome.history.search(query, function (results) {
		// resultsは配列なので、forEach()関数を実行することが出来る
		results.forEach(function (result) {
			// resultひとつひとつがHistoryItem形式
			historyList.push({
				url: result.url,
				title: result.title
			})
		});

		console.log(historyList)
		console.log(results.length)
		muff.setSearchWordList(historyList)
	});

	muff.setReturnListLength(20)
}

