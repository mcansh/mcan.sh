import { asyncContext } from "remix/async-context-middleware"
import { createRouter } from "remix/fetch-router"
import { describe, expect, it, vi } from "vitest"

import { securityHeaderMiddleware } from "./security.ts"

vi.mock("#app/lib/env.ts", () => {
	return {
		env: {
			CLOUDINARY_CLOUD_NAME: "test-cloud",
			SENTRY_REPORT_URL: "https://sentry.io",
			FATHOM_SITE_ID: "12345",
			SENTRY_DSN: "12345",
		},
	}
})

describe("securityHeaderMiddleware", () => {
	it("should add security headers to the response", async () => {
		const router = createRouter({
			middleware: [asyncContext(), securityHeaderMiddleware()],
		})

		router.map("*", (context) => {
			return new Response(`ok:${context.url.pathname}`)
		})

		const response = await router.fetch(new Request("http://localhost/"))

		expect(response.headers.get("Content-Security-Policy")).toBeDefined()
	})

	it("should skip adding security headers when skip function returns true", async () => {
		const router = createRouter({
			middleware: [
				asyncContext(),
				securityHeaderMiddleware({
					skip(context) {
						return context.url.pathname === "/skip"
					},
				}),
			],
		})

		router.map("*", (context) => {
			return new Response(`ok: ${context.url.pathname}`)
		})

		const responseWithHeaders = await router.fetch(
			new Request("http://localhost"),
		)

		expect(
			responseWithHeaders.headers.get("Content-Security-Policy"),
		).toBeDefined()

		const responseWithoutHeaders = await router.fetch(
			new Request("http://localhost/skip"),
		)

		expect(
			responseWithoutHeaders.headers.get("Content-Security-Policy"),
		).toBeNull()
	})
})
