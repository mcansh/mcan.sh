import { adapterContext } from "#workers/app.js";
import {
	createNonce,
	createSecureHeaders,
	mergeHeaders,
} from "@mcansh/http-helmet";
import { NonceProvider } from "@mcansh/http-helmet/react";
import { isbot } from "isbot";
import { renderToReadableStream } from "react-dom/server";
import type {
	EntryContext,
	HandleDataRequestFunction,
	unstable_RouterContextProvider,
} from "react-router";
import { ServerRouter } from "react-router";
import { isPrefetch } from "remix-utils/is-prefetch";
import { preloadRouteAssets } from "remix-utils/preload-route-assets";

export default async function handleRequest(
	request: Request,
	responseStatusCode: number,
	responseHeaders: Headers,
	routerContext: EntryContext,
	loadContext: unstable_RouterContextProvider,
) {
	let shellRendered = false;
	let userAgent = request.headers.get("user-agent");
	preloadRouteAssets(routerContext, responseHeaders);
	let { nonce, headers } = applySecurityHeaders(
		loadContext,
		request,
		responseHeaders,
	);

	let body = await renderToReadableStream(
		<NonceProvider nonce={nonce}>
			<ServerRouter context={routerContext} url={request.url} nonce={nonce} />
		</NonceProvider>,
		{
			nonce,
			onError(error: unknown) {
				responseStatusCode = 500;
				// Log streaming rendering errors from inside the shell.  Don't log
				// errors encountered during initial shell rendering since they'll
				// reject and get logged in handleDocumentRequest.
				if (shellRendered) {
					console.error(error);
				}
			},
		},
	);
	shellRendered = true;

	// Ensure requests from bots and SPA Mode renders wait for all content to load before responding
	// https://react.dev/reference/react-dom/server/renderToPipeableStream#waiting-for-all-content-to-load-for-crawlers-and-static-generation
	if ((userAgent && isbot(userAgent)) || routerContext.isSpaMode) {
		await body.allReady;
	}

	responseHeaders.set("Content-Type", "text/html");
	return new Response(body, {
		headers: mergeHeaders(responseHeaders, headers),
		status: responseStatusCode,
	});
}

export let handleDataRequest: HandleDataRequestFunction = async (
	response,
	{ request, context },
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

	let { headers } = applySecurityHeaders(context, request, response.headers);

	return new Response(response.body, { status: response.status, headers });
};

function applySecurityHeaders(
	loadContext: unstable_RouterContextProvider,
	request: Request,
	responseHeaders: Headers,
) {
	let env = loadContext.get(adapterContext);
	console.log({ env });

	if (import.meta.env.DEV) {
		responseHeaders.set("Cache-Control", "no-cache");
	}

	let url = new URL(request.url);

	let upgradeInsecureRequests =
		import.meta.env.PROD && !url.host.includes("localhost");

	let cloudflareEmailDecodePath = new URL(
		"/cdn-cgi/scripts/*/cloudflare-static/email-decode.min.js",
		url.origin,
	).toString();

	let nonce = createNonce();
	let securityHeaders = createSecureHeaders({
		"Content-Security-Policy": {
			"upgrade-insecure-requests": upgradeInsecureRequests,
			"default-src": ["'none'"],
			"base-uri": ["'self'"],
			"img-src": [
				"'self'",
				`https://res.cloudinary.com/${env.CLOUDINARY_CLOUD_NAME}/image/upload/`,
				"https://cdn.usefathom.com/",
			],
			"script-src": [
				"'self'",
				"https://cdn.usefathom.com/script.js",
				cloudflareEmailDecodePath,
				`'nonce-${nonce}'`,
				"'strict-dynamic'",
			],
			"connect-src": ["'self'", ...(import.meta.env.DEV ? ["ws:"] : [])],
			"worker-src": ["blob:"],
			"manifest-src": ["'self'"],
			"font-src": ["'self'"],
			"style-src": ["'self'"],
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
	});

	let headers = mergeHeaders(responseHeaders, securityHeaders);

	let permissionsPolicy = securityHeaders.get("Permissions-Policy");

	if (permissionsPolicy) {
		headers.set("Feature-Policy", permissionsPolicy);
	}

	headers.set(`Expect-CT`, `report-uri="${env.SENTRY_REPORT_URL}"`);

	return { nonce, headers };
}
