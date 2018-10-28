import { muff } from "muff"
import Vue from "vue/dist/vue.esm.js"

window.onload = function() {
	init()
}

function init() {
	Vue.component('muffin-search-component', {
		data() {
			return {
				inputValue: '',
				resultList: []
			}
		},
		template: `
			<div>
				<input @keyup="search" v-model="inputValue" type="text">
				<div>
					{{ inputValue }}
				</div>
				<ul>
					<li v-for="item in resultList">
						<a v-bind:href="item.url" target="_blank">{{ item.title }}</a>
						<span>{{ item.url }}</span>
					</li>
				</ul>
			</div>
		`,
		methods: {
			search: function() {
				console.log(this.inputValue)
				let result = muff.search(this.inputValue)
				console.log(result)
				this.resultList = result.list
			}
		}
	})

	new Vue({el: '#muffin'})


	const query = { text: '', maxResults: 1000 }
	let historyList = []
	chrome.history.search(query, function (results) {
		// resultsは配列なので、forEach()関数を実行することが出来る
		results.forEach(function (result) {
			// resultひとつひとつがHistoryItem形式
			console.log(result.url)
			console.log(result.title)
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

