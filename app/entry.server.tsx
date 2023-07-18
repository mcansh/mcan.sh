import crypto from "node:crypto";
import { PassThrough } from "node:stream";
import type { EntryContext, HandleDataRequestFunction } from "@remix-run/node";
import { Response } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { createSecureHeaders } from "@mcansh/remix-secure-headers";
import { renderToPipeableStream } from "react-dom/server";
import { isPrefetch, preloadRouteAssets } from "remix-utils";
import isbot from "isbot";

import { NonceContext } from "./components/nonce";

const ABORT_DELAY = 5_000;

export default async function handleRequest(
	request: Request,
	responseStatusCode: number,
	responseHeaders: Headers,
	remixContext: EntryContext,
) {
	// @ts-expect-error - newer versions of remix have a `serializeError` function on context
	preloadRouteAssets(remixContext, responseHeaders);
	let callback = isbot(request.headers.get("user-agent"))
		? "onAllReady"
		: "onShellReady";

	let nonce = applySecurityHeaders(responseHeaders);

	return new Promise((resolve, reject) => {
		let shellRendered = false;
		let { pipe, abort } = renderToPipeableStream(
			<NonceContext.Provider value={nonce}>
				<RemixServer
					context={remixContext}
					url={request.url}
					abortDelay={ABORT_DELAY}
				/>
			</NonceContext.Provider>,
			{
				[callback]() {
					shellRendered = true;
					let body = new PassThrough();

					responseHeaders.set("Content-Type", "text/html");

					resolve(
						new Response(body, {
							headers: responseHeaders,
							status: responseStatusCode,
						}),
					);

					pipe(body);
				},
				onShellError(error) {
					reject(error);
				},
				onError(error) {
					responseStatusCode = 500;
					// Log streaming rendering errors from inside the shell.
					// Don't log errors encountered during initial shell rendering since they'll
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

	applySecurityHeaders(response.headers);

	return response;
};

function applySecurityHeaders(responseHeaders: Headers) {
	if (process.env.NODE_ENV === "development") {
		responseHeaders.set("Cache-Control", "no-cache");
	}

	let nonce = crypto.randomBytes(16).toString("base64");
	let securityHeaders = createSecureHeaders({
		"Content-Security-Policy": {
			upgradeInsecureRequests: process.env.NODE_ENV === "production",
			baseUri: ["'self'"],
			defaultSrc: ["'none'"],
			fontSrc: ["'self'"],
			imgSrc: [
				"'self'",
				"https://res.cloudinary.com/dof0zryca/image/upload/",
				"https://thirtyseven-active.b-cdn.net",
			],
			scriptSrc: [
				"'self'",
				"https://thirtyseven-active.b-cdn.net/script.js",
				`'nonce-${nonce}'`,
			],
			styleSrc: ["'self'"],
			manifestSrc: ["'self'"],
			prefetchSrc: ["'self'"],
			connectSrc:
				process.env.NODE_ENV === "development" ? ["ws:", "'self'"] : ["'self'"],
			workerSrc: ["blob:"],
			reportUri: [
				"https://o74198.ingest.sentry.io/api/268464/security/?sentry_key=4b455db031a845c3aefc7540b16e3a16",
			],
		},
		"Referrer-Policy": "origin-when-cross-origin",
		"X-Frame-Options": "DENY",
		"X-Content-Type-Options": "nosniff",
		"X-DNS-Prefetch-Control": "on",
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

	for (let header of securityHeaders) {
		responseHeaders.set(...header);
	}

	let permissionsPolicy = securityHeaders.get("Permissions-Policy");

	if (permissionsPolicy) {
		responseHeaders.set("Feature-Policy", permissionsPolicy);
	}

	responseHeaders.set(
		`Expect-CT`,
		`report-uri="https://o74198.ingest.sentry.io/api/268464/security/?sentry_key=4b455db031a845c3aefc7540b16e3a16"`,
	);

	return nonce;
}
