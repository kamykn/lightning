import { muff } from "muff"
import Vue from "vue/dist/vue.esm.js"

window.onload = function() {
	init()
}

function init() {
	Vue.component('muffin-search-component', {
		data() {
			return {
				inputValue: ''
			}
		},
		template: `
			<div>
				<input v-on:change="search" v-model="inputValue" type="text">
				{{ inputValue }}
			</div>
		`,
		methods: {
			search: function() {
				console.log(5)
				let r = muff.search(this.inputValue);
				console.log(r)
			}
		}
	})

	new Vue({el: '#muffin'})

	muff.setReturnListLength(20)
	muff.setSearchWordList(['aaa', 'bbb', 'ccc'])
}

