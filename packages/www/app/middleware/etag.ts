import type { Middleware } from "remix/fetch-router"

export async function createEtag(content: string): Promise<string> {
	let msgUint8 = new TextEncoder().encode(content)
	let hashBuffer = await crypto.subtle.digest("MD5", msgUint8)
	let hashArray = Array.from(new Uint8Array(hashBuffer))
	let hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
	return `W/"${hashHex}"`
}

export function notModifiedMiddleware(): Middleware {
	return async (context, next) => {
		let response = await next()
		if (context.request.method !== "GET") return response

		let etag = response.headers.get("ETag")

		let responseContent = await response.clone().text()
		let expectedEtag = await createEtag(responseContent)

		if (etag && etag === expectedEtag) {
			return new Response(null, {
				status: 304,
				statusText: "Not Modified",
				headers: { ETag: etag },
			})
		}

		response.headers.append("ETag", expectedEtag)

		return new Response(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers: response.headers,
		})
	}
}
