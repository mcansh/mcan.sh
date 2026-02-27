import { run } from "remix/component"

function safeJsonParse(input: string) {
	try {
		return JSON.parse(input)
	} catch {
		return null
	}
}

let app = run(document, {
	async loadModule(moduleUrl, exportName) {
		let untypedChunks = safeJsonParse(moduleUrl)
		let chunks = Array.isArray(untypedChunks)
			? untypedChunks.filter((src) => typeof src === "string")
			: []

		let [mod] = await Promise.all(
			chunks.map((chunk) => import(/* @vite-ignore */ chunk)),
		)
		return mod[exportName]
	},
	async resolveFrame(src) {
		let response = await fetch(new URL(src, location.href))
		return await response.text()
	},
})

app.ready().catch((error) => {
	console.error("Frame adoption failed:", error)
})

if (import.meta.hot) {
	import.meta.hot.accept()
}
