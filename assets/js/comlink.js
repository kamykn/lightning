import * as Comlink from 'comlinkjs'
const Muff = import('muff')

const wasm = {
	// 検索件数上限
	maxSearchWordListLen: 0,

	init: async function(maxSearchWordListLen) {
		this.maxSearchWordListLen = maxSearchWordListLen

		// このオブジェクトにWebAssemblyをマージして使う
		const muff = await Muff
		Object.assign(wasm, muff.default);
	},

	setSearchWordListWrapper(searchWordList) {
		if (this.maxSearchWordListLen <= 0) {
			console.log('Please set "maxSearchWordListLen" over 1.')
		}
		// 検索件数に上限を設ける
		searchWordList = searchWordList.slice(0, this.maxSearchWordListLen)
		this.setSearchWordList(searchWordList)
	}
}

Comlink.expose(wasm, self)
