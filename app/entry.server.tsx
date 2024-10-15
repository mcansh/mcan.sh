import { createSecureHeaders, mergeHeaders } from "@mcansh/http-helmet";
import { NonceProvider, createNonce } from "@mcansh/http-helmet/react";
import type {
	AppLoadContext,
	EntryContext,
	HandleDataRequestFunction,
} from "@remix-run/cloudflare";
import { RemixServer } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToReadableStream } from "react-dom/server";
import { isPrefetch } from "remix-utils/is-prefetch";
import { preloadRouteAssets } from "remix-utils/preload-route-assets";

export default async function handleRequest(
	request: Request,
	responseStatusCode: number,
	responseHeaders: Headers,
	remixContext: EntryContext,
	loadContext: AppLoadContext,
) {
	preloadRouteAssets(remixContext, responseHeaders);

	let { nonce, headers } = applySecurityHeaders(
		loadContext,
		request,
		responseHeaders,
	);

	let body = await renderToReadableStream(
		<NonceProvider nonce={nonce}>
			<RemixServer context={remixContext} url={request.url} nonce={nonce} />
		</NonceProvider>,
		{
			nonce,
			signal: request.signal,
			onError(error: unknown) {
				// Log streaming rendering errors from inside the shell.
				console.error(error);
				responseStatusCode = 500;
			},
		},
	);

	if (isbot(request.headers.get("user-agent"))) {
		await body.allReady;
	}

	headers.set("Content-Type", "text/html");

	return new Response(body, {
		headers,
		status: responseStatusCode,
	});
}

export let handleDataRequest: HandleDataRequestFunction = async (
	response,
	{ context, request },
) => {
	// if it's a GET request and it's a prefetch request
	// and it doesn't already have a Cache-Control header
	// we will cache for 10 seconds only on the browser
	if (
		request.method.toLowerCase() === "get" &&
		isPrefetch(request) &&
		!response.headers.has("Cache-Control")
	) {
		response.headers.set("Cache-Control", "private, max-age=10");
	}

	applySecurityHeaders(context, request, response.headers);

	return response;
};

function applySecurityHeaders(
	loadContext: AppLoadContext,
	request: Request,
	responseHeaders: Headers,
) {
	if (process.env.NODE_ENV === "development") {
		responseHeaders.set("Cache-Control", "no-cache");
	}

	let url = new URL(request.url);

	let fathomScriptDomain = "https://cdn.usefathom.com/script.js";

	let nonce = createNonce();
	let securityHeaders = createSecureHeaders({
		"Content-Security-Policy": {
			"base-uri": ["'self'"],
			"default-src": ["'self'"],
			"img-src": [
				"'self'",
				`https://res.cloudinary.com/${loadContext.env.CLOUDINARY_CLOUD_NAME}/image/upload/`,
				fathomScriptDomain,
			],
			"script-src": [
				"'self'",
				new URL("script.js", fathomScriptDomain).toString(),
				new URL(
					"cdn-cgi/scripts/*/cloudflare-static/email-decode.min.js",
					url.origin,
				).toString(),
				`'nonce-${nonce}'`,
				"'strict-dynamic'",
			],
			"script-src-attr": [`'nonce-${nonce}'`],
			"connect-src": [
				...(process.env.NODE_ENV === "production"
					? ["'self'"]
					: ["'self'", "ws:"]),
			],
			"worker-src": ["blob:"],
			"report-uri": [loadContext.env.SENTRY_REPORT_URL],
		},
		"Referrer-Policy": "origin-when-cross-origin",
		"X-Frame-Options": "DENY",
		"X-Content-Type-Options": "nosniff",
		"X-DNS-Prefetch-Control": "on",
		"X-XSS-Protection": "1; mode=block",
		"Strict-Transport-Security": {
			maxAge: 31536000,
			includeSubDomains: true,
			preload: true,
		},
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
	});

	responseHeaders = mergeHeaders(responseHeaders, securityHeaders);

	let permissionsPolicy = securityHeaders.get("Permissions-Policy");

	if (permissionsPolicy) {
		responseHeaders.set("Feature-Policy", permissionsPolicy);
	}

	responseHeaders.set(
		`Expect-CT`,
		`report-uri="${loadContext.env.SENTRY_REPORT_URL}"`,
	);

	// TODO: fix upstream in @mcansh/http-helmet
	if (process.env.NODE_ENV === "production") {
		responseHeaders.append("Upgrade-Insecure-Requests", "1");
	}

	return { nonce, headers: responseHeaders };
}
