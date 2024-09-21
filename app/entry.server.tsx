import { PassThrough } from "node:stream";

import { createSecureHeaders, mergeHeaders } from "@mcansh/http-helmet";
import { NonceProvider, createNonce } from "@mcansh/http-helmet/react";
import { createReadableStreamFromReadable } from "@react-router/node";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import type {
	AppLoadContext,
	EntryContext,
	HandleDataRequestFunction,
} from "react-router";
import { ServerRouter } from "react-router";

import { env } from "./env.server";

// Reject all pending promises from handler functions after timeout
export const streamTimeout = 5_000;
// Automatically timeout the react renderer after timeout
const ABORT_DELAY = 5_000;

export default function handleRequest(
	request: Request,
	responseStatusCode: number,
	responseHeaders: Headers,
	remixContext: EntryContext,
	_loadContext: AppLoadContext,
) {
	let callback = isbot(request.headers.get("user-agent"))
		? "onAllReady"
		: "onShellReady";

	// preloadRouteAssets(remixContext, responseHeaders);

	let { nonce, headers } = applySecurityHeaders(request, responseHeaders);

	return new Promise((resolve, reject) => {
		let shellRendered = false;
		let { pipe, abort } = renderToPipeableStream(
			<NonceProvider nonce={nonce}>
				<ServerRouter
					context={remixContext}
					url={request.url}
					abortDelay={ABORT_DELAY}
					nonce={nonce}
				/>
			</NonceProvider>,
			{
				nonce,
				[callback]() {
					shellRendered = true;
					let body = new PassThrough();
					let stream = createReadableStreamFromReadable(body);

					headers.set("Content-Type", "text/html");

					resolve(
						new Response(stream, { headers, status: responseStatusCode }),
					);

					pipe(body);
				},
				onShellError(error: unknown) {
					reject(error);
				},
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

		setTimeout(abort, ABORT_DELAY);
	});
}

export let handleDataRequest: HandleDataRequestFunction = async (
	response,
	{ request },
) => {
	applySecurityHeaders(request, response.headers);

	return response;
};

function applySecurityHeaders(request: Request, responseHeaders: Headers) {
	if (process.env.NODE_ENV === "development") {
		responseHeaders.set("Cache-Control", "no-cache");
	}

	let url = new URL(request.url);

	let nonce = createNonce();
	let securityHeaders = createSecureHeaders({
		"Content-Security-Policy": {
			// "upgrade-insecure-requests": process.env.NODE_ENV === "production",
			"base-uri": ["'self'"],
			"default-src": ["'self'"],
			"img-src": [
				"'self'",
				"https://res.cloudinary.com/dof0zryca/image/upload/",
				"https://thirtyseven-active.b-cdn.net",
			],
			"script-src": [
				"'self'",
				"https://thirtyseven-active.b-cdn.net/script.js",
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
			"report-uri": [env.SENTRY_REPORT_URL],
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

	let merged = mergeHeaders(responseHeaders, securityHeaders);

	let permissionsPolicy = securityHeaders.get("Permissions-Policy");

	if (permissionsPolicy) {
		merged.set("Feature-Policy", permissionsPolicy);
	}

	merged.set(`Expect-CT`, `report-uri="${env.SENTRY_REPORT_URL}"`);

	return { nonce, headers: merged };
}
