import xml from "dedent"
import type { BuildAction } from "remix/fetch-router"

import { notModifiedMiddleware } from "#app/middleware/etag.ts"
import { routes } from "#app/routes.ts"

function createUrl(origin: string, path: string): string {
	return new URL(path, origin).href
}

export const sitemapHandler = {
	middleware: [notModifiedMiddleware()],
	action({ url }) {
		let content = xml`
			<?xml version="1.0" encoding="UTF-8"?>
			<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
				<url>
					<loc>${createUrl(url.origin, routes.home.href())}</loc>
					<priority>1.0</priority>
				</url>
				<url>
					<loc>${createUrl(url.origin, routes.resume.href())}</loc>
					<priority>1.0</priority>
				</url>
			</urlset>
			<url>
				<loc>${createUrl(url.origin, routes.wellKnown.href({ path: "avatar" }))}</loc>
				<priority>1.0</priority>
			</url>
		`

		return new Response(content.trim(), {
			headers: {
				"Content-Type": "application/xml",
				"Cache-Control": "public, max-age=3600",
			},
		})
	},
} satisfies BuildAction<"GET", typeof routes.sitemap>
