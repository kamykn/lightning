import { muff } from "muff"

muff.setReturnListLength(20)
muff.setSearchWordList(['aaa', 'bbb', 'ccc'])

document.getElementById("search").addEventListener("change", () => {
	let inputStr = this.value
	muffSearch(inputStr)
})

function muffSearch(inputStr) {
	let result = muff.search(inputStr)
	console.log(result)
}

