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
						{{ item }}
					</li>
				</ul>
			</div>
		`,
		methods: {
			search: function() {
				console.log(this.inputValue)
				let result = muff.search(this.inputValue);
				console.log(result)
				this.resultList = result.list
			}
		}
	})

	new Vue({el: '#muffin'})


	const query = { text: '' }
	let historyList = []
	chrome.history.search(query, function (results) {
		// resultsは配列なので、forEach()関数を実行することが出来る
		results.forEach(function (result) {
			// resultひとつひとつがHistoryItem形式
			console.log(result)
			console.log(result.title)
			historyList.push(result.url);
			// historyList.push(result.title) // マルチバイトかなんかダメ説
		});

		console.log(historyList)
		muff.setSearchWordList(historyList)
	});


	muff.setReturnListLength(20)
}

