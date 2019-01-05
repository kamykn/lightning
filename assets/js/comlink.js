import * as Comlink from 'comlinkjs'
const Muff = import('muff')

const wasm = {
	init: async function() {
		const muff = await Muff
		Object.assign(wasm, muff.default);
	}
}

Comlink.expose(wasm, self)
