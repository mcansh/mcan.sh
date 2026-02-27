import { setCSPNonce } from "#app/lib/context.ts"
import { env } from "#app/lib/env.ts"
import {
	createNonce,
	createSecureHeaders,
	mergeHeaders,
	NONCE,
} from "@mcansh/http-helmet"
import type { Middleware } from "remix/fetch-router"

type SecurityHeaderMiddlewareOptions = {
	skip?: (context: Parameters<Middleware>[0]) => boolean
}

export function securityHeaderMiddleware({
	skip,
}: SecurityHeaderMiddlewareOptions = {}): Middleware {
	return async (context, next) => {
		if (skip?.(context)) return next()

		let nonce = createNonce()
		setCSPNonce(nonce)

		let upgradeInsecureRequests =
			import.meta.env.PROD && !context.url.host.includes("localhost")

		let cloudflareEmailDecodePath = new URL(
			"/cdn-cgi/scripts/*/cloudflare-static/email-decode.min.js",
			context.url.origin,
		).href

		let secureHeaders = createSecureHeaders({
			"Content-Security-Policy": {
				"upgrade-insecure-requests": upgradeInsecureRequests,
				"default-src": ["'none'"],
				"base-uri": ["'self'"],
				"img-src": [
					"'self'",
					env.CLOUDINARY_URL,
					"https://cdn.usefathom.com/",
					NONCE(nonce),
				],
				"script-src": [
					"'self'",
					"https://cdn.usefathom.com/script.js",
					cloudflareEmailDecodePath,
					NONCE(nonce),
				],
				"connect-src": ["'self'", ...(import.meta.env.DEV ? ["ws:"] : [])],
				"worker-src": ["blob:"],
				"manifest-src": ["'self'"],
				"font-src": ["'self'"],
				"report-uri": [env.SENTRY_REPORT_URL],
			},
			"X-Frame-Options": "DENY",
			"X-Content-Type-Options": "nosniff",
			"X-DNS-Prefetch-Control": "on",
			"X-XSS-Protection": "1; mode=block",
			"Strict-Transport-Security": true,
			"Permissions-Policy": {
				accelerometer: [],
				"ambient-light-sensor": [],
				autoplay: [],
				battery: [],
				camera: [],
				"display-capture": [],
				"document-domain": [],
				"encrypted-media": [],
				"execution-while-not-rendered": [],
				"execution-while-out-of-viewport": [],
				fullscreen: [],
				gamepad: [],
				geolocation: [],
				gyroscope: [],
				"layout-animations": [],
				"legacy-image-formats": [],
				magnetometer: [],
				microphone: [],
				midi: [],
				"navigation-override": [],
				"oversized-images": [],
				payment: [],
				"picture-in-picture": [],
				"publickey-credentials-get": [],
				"speaker-selection": [],
				"sync-xhr": [],
				"unoptimized-images": [],
				"unsized-media": [],
				usb: [],
				"screen-wake-lock": [],
				"web-share": [],
				"xr-spatial-tracking": [],
			},
			"Cross-Origin-Opener-Policy": "same-origin",
			"Referrer-Policy": "same-origin",
		})

		let response = await next()

		let headers = mergeHeaders(response.headers, secureHeaders)

		let permissionsPolicy = secureHeaders.get("Permissions-Policy")

		if (permissionsPolicy) {
			headers.set("Feature-Policy", permissionsPolicy)
		}

		headers.set(`Expect-CT`, `report-uri="${env.SENTRY_REPORT_URL}"`)

		return new Response(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers: mergeHeaders(response.headers, secureHeaders),
		})
	}
}
