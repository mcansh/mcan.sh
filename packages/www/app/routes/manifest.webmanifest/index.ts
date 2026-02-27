import type { BuildAction } from "remix/fetch-router"

import { notModifiedMiddleware } from "#app/middleware/etag.ts"
import type { routes } from "#app/routes.ts"
import { iconSizes, linkColor } from "./utils.ts"

let content = {
	name: "Logan McAnsh",
	short_name: "LM",
	description: "personal website for logan mcansh",
	start_url: "/?homescreen=1",
	background_color: linkColor,
	theme_color: linkColor,
	display: "standalone",
	icons: iconSizes,
}

export const manifestHandler = {
	middleware: [notModifiedMiddleware()],
	async action() {
		let webmanifest = JSON.stringify(content, null, 2)

		return new Response(webmanifest, {
			headers: {
				"Cache-Control": "public, max-age=60, must-revalidate",
				"Content-Type": "application/json",
			},
		})
	},
} satisfies BuildAction<"GET", typeof routes.manifest>
